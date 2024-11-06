# API Authentication Documentation

## Overview

This API uses **ASP.NET Core Identity** with **JWT (JSON Web Tokens)** for secure authentication. Users register with their email and password, log in to receive a JWT token, and use that token to access protected API endpoints. The setup includes **PostgreSQL** as the database, running in a **Docker container**.

### Components
- **ASP.NET Core Identity** for user management and roles.
- **JWT** for token-based authentication.
- **PostgreSQL** database, managed with **Entity Framework Core** migrations.
- **Docker** for running PostgreSQL in a container.

---

## Step-by-Step Setup and Configuration

### 1. Setting Up `ApplicationDbContext` with ASP.NET Core Identity

We created an `ApplicationDbContext` class, which inherits from `IdentityDbContext<User, IdentityRole<long>, long>`. This allowed us to use `long` as the primary key type for both users and roles.

#### Code:
```csharp
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MihajlovAutoRepairApi.Models;

public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<long>, long>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
}
```

### 2. Registering Identity and JWT in `Program.cs`

We added services for **ASP.NET Core Identity** and configured **JWT-based authentication** in `Program.cs`. Initially, we encountered an issue because `AddEntityFrameworkStores<ApplicationDbContext>()` was not recognized, which we fixed by ensuring the `Microsoft.AspNetCore.Identity.EntityFrameworkCore` package was installed.

#### Code:
```csharp
var builder = WebApplication.CreateBuilder(args);

// Configure PostgreSQL and Identity
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<User, IdentityRole<long>>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Configure JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
```

### 3. Generating a Secure JWT Key and Configuring `appsettings.json`

For the JWT signing key, we generated a secure 32-character key to ensure it met the security requirements. We added this key along with the Issuer and Audience values in `appsettings.json`.

#### `appsettings.json` Configuration:
```json
{
  "Jwt": {
    "Key": "Y2Fkc2FkYXV2aGVjYXNkZ2FzZGZoamtsZ25ncQ==", // A secure key we generated
    "Issuer": "localhost",
    "Audience": "localhost",
    "ExpiryInMinutes": 60
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=mydb;Username=myuser;Password=mypassword"
  }
}
```

### 4. User Registration and Login in `AccountController`

We created endpoints for user registration and login in `AccountController`. During testing, we encountered some issues:
- **Password Complexity Requirements**: We received errors when passwords didn’t meet ASP.NET Core Identity's default password requirements.
- **Identity Tables Missing**: We encountered `relation "AspNetUsers" does not exist` errors, which we resolved by ensuring migrations were correctly applied to PostgreSQL.

#### User Registration Endpoint:
```csharp
[HttpPost("register")]
public async Task<IActionResult> Register([FromBody] RegisterDto model)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
    var result = await _userManager.CreateAsync(user, model.Password);

    if (result.Succeeded)
    {
        return Ok("User created successfully");
    }

    return BadRequest(result.Errors);
}
```

#### User Login Endpoint:
```csharp
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginDto model)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);

    if (result.Succeeded)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        var token = GenerateJwtToken(user);
        return Ok(new { token });
    }

    return Unauthorized();
}
```

### 5. JWT Token Generation Method

We implemented a `GenerateJwtToken` method to create JWT tokens upon successful login. Initially, we encountered the `IDX10634: Unable to create the SignatureProvider` error because our JWT signing key was too short. We resolved this by using a key with a minimum length of 16 characters.

#### GenerateJwtToken Code:
```csharp
private string GenerateJwtToken(ApplicationUser user)
{
    var claims = new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Email),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: _configuration["Jwt:Issuer"],
        audience: _configuration["Jwt:Audience"],
        claims: claims,
        expires: DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["Jwt:ExpiryInMinutes"])),
        signingCredentials: creds);

    return new JwtSecurityTokenHandler().WriteToken(token);
}
```

### 6. Protecting Endpoints with `[Authorize]`

We secured specific endpoints with the `[Authorize]` attribute. During testing, we initially encountered `401 Unauthorized` errors when sending the token, which we resolved by ensuring:
1. The token was formatted as `Bearer <token>`.
2. `UseAuthentication()` and `UseAuthorization()` were in the correct order in `Program.cs`.

#### Example of Protected Endpoint:
```csharp
[Authorize]
[HttpGet("secure-endpoint")]
public IActionResult SecureEndpoint()
{
    return Ok("You have accessed a protected endpoint!");
}
```

### 7. Testing and Troubleshooting

Throughout the implementation, we encountered and resolved several issues:
- **401 Unauthorized Errors**: These were mostly due to missing `Bearer` prefixes or expired tokens.
- **JWT Not Well Formed Error**: This error occurred when tokens were incorrectly formatted. We verified token generation using [jwt.io](https://jwt.io/) to inspect the header, payload, and signature.
- **Database Connection Issues**: We ensured the Docker container running PostgreSQL was accessible and that migrations were properly applied.

### Final Workflow

1. **User Registration**: Users register with their email and password via the `/register` endpoint.
2. **User Login**: Users log in via the `/login` endpoint to receive a JWT token.
3. **Accessing Protected Endpoints**: The token is included in the `Authorization: Bearer <token>` header when accessing endpoints with `[Authorize]`.
4. **Token Validation**: The server validates the token’s signature, issuer, audience, and expiration date, granting or denying access based on these checks.

---

## Summary

This setup provides a secure and scalable authentication system for the API using ASP.NET Core Identity and JWTs. By following these steps, we configured Identity with PostgreSQL, generated secure JWT tokens, and protected endpoints with `[Authorize]`. The API is now ready for users to register, log in, and access protected resources using JWT-based authentication.


# CRUD Functionality Documentation

## Overview

This API provides CRUD operations for managing entities such as **Users**, **Reservations**, **Models**, and **Types**. Each operation is accessible through specific endpoints, with **role-based authorization** enforced for certain actions. Administrators have elevated permissions to perform sensitive operations like creating, updating, or deleting entities.

The CRUD operations were implemented using **Entity Framework Core** with **ASP.NET Core** and **ASP.NET Identity** to manage permissions.

---

## General Structure of CRUD Operations

Each entity has its own controller with standard CRUD endpoints:
1. **Create**: Adds a new record to the database.
2. **Read**: Retrieves one or more records.
3. **Update**: Modifies an existing record.
4. **Delete**: Removes a record from the database.

### Role-Based Access Control

Role-based access is implemented using ASP.NET Core Identity. For sensitive operations (like `Create`, `Update`, and `Delete`), we used the `[Authorize(Roles = "Admin")]` attribute to ensure only administrators can perform these actions.

---

## CRUD Operations for Each Entity

### 1. `User` Entity

The `User` entity is managed through the `AccountController` for registration and login, but CRUD operations for user management (like getting all users or updating a user) can be done via a `UserController`.

#### UserController Actions

1. **Get All Users**: Retrieves a list of all users.
   - **Endpoint**: `GET /api/User`
   - **Access**: Admin only.

   ```csharp
   [Authorize(Roles = "Admin")]
   [HttpGet]
   public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
   {
       var users = await _userManager.Users.ToListAsync();
       return Ok(users.Select(u => new UserDto(u)));
   }
   ```

2. **Get User by ID**: Retrieves a specific user by ID.
   - **Endpoint**: `GET /api/User/{id}`
   - **Access**: Admin only.

3. **Create User**: Typically handled through the registration endpoint in `AccountController`.

4. **Update User**: Allows updating user information.
   - **Endpoint**: `PUT /api/User/{id}`
   - **Access**: Admin only.

5. **Delete User**: Deletes a user account.
   - **Endpoint**: `DELETE /api/User/{id}`
   - **Access**: Admin only.

   ```csharp
   [Authorize(Roles = "Admin")]
   [HttpDelete("{id}")]
   public async Task<IActionResult> DeleteUser(long id)
   {
       var user = await _userManager.FindByIdAsync(id.ToString());
       if (user == null)
       {
           return NotFound();
       }

       var result = await _userManager.DeleteAsync(user);
       return result.Succeeded ? NoContent() : BadRequest(result.Errors);
   }
   ```

### 2. `Reservation` Entity

The `Reservation` entity allows users to create and manage reservations. Only administrators can perform create, update, and delete operations.

#### ReservationController Actions

1. **Get All Reservations**: Lists all reservations in the system.
   - **Endpoint**: `GET /api/Reservation`
   - **Access**: Authenticated users.

   ```csharp
   [Authorize]
   [HttpGet]
   public async Task<ActionResult<IEnumerable<ReservationDto>>> GetReservations()
   {
       var reservations = await _reservationRepository.GetAllAsync();
       return Ok(reservations);
   }
   ```

2. **Get Reservation by ID**: Retrieves a specific reservation by ID.
   - **Endpoint**: `GET /api/Reservation/{id}`
   - **Access**: Authenticated users.

3. **Create Reservation**: Adds a new reservation.
   - **Endpoint**: `POST /api/Reservation`
   - **Access**: Admin only.

4. **Update Reservation**: Modifies an existing reservation.
   - **Endpoint**: `PUT /api/Reservation/{id}`
   - **Access**: Admin only.

5. **Delete Reservation**: Removes a reservation.
   - **Endpoint**: `DELETE /api/Reservation/{id}`
   - **Access**: Admin only.

### 3. `Model` Entity

The `Model` entity is used to manage different models available in the system. This could represent a specific item or type.

#### ModelController Actions

1. **Get All Models**: Lists all models.
   - **Endpoint**: `GET /api/Model`
   - **Access**: Public (no authorization required).

2. **Get Model by ID**: Retrieves a specific model by ID.
   - **Endpoint**: `GET /api/Model/{id}`
   - **Access**: Public.

3. **Create Model**: Adds a new model to the database.
   - **Endpoint**: `POST /api/Model`
   - **Access**: Admin only.

   ```csharp
   [Authorize(Roles = "Admin")]
   [HttpPost]
   public async Task<IActionResult> CreateModel([FromBody] ModelCreateDto modelCreateDto)
   {
       var model = _mapper.Map<Model>(modelCreateDto);
       await _modelRepository.AddAsync(model);
       return CreatedAtAction(nameof(GetModel), new { id = model.Id }, model);
   }
   ```

4. **Update Model**: Modifies an existing model.
   - **Endpoint**: `PUT /api/Model/{id}`
   - **Access**: Admin only.

5. **Delete Model**: Deletes a model.
   - **Endpoint**: `DELETE /api/Model/{id}`
   - **Access**: Admin only.

### 4. `Type` Entity

The `Type` entity represents different types or categories.

#### TypeController Actions

1. **Get All Types**: Retrieves all types.
   - **Endpoint**: `GET /api/Type`
   - **Access**: Public.

2. **Get Type by ID**: Retrieves a specific type by ID.
   - **Endpoint**: `GET /api/Type/{id}`
   - **Access**: Public.

3. **Create Type**: Adds a new type.
   - **Endpoint**: `POST /api/Type`
   - **Access**: Admin only.

4. **Update Type**: Updates a type’s details.
   - **Endpoint**: `PUT /api/Type/{id}`
   - **Access**: Admin only.

5. **Delete Type**: Removes a type.
   - **Endpoint**: `DELETE /api/Type/{id}`
   - **Access**: Admin only.

---

## How CRUD Operations Work

### Authorization

- **Admin-Only Endpoints**: Certain endpoints, like `POST`, `PUT`, and `DELETE` for all entities, are restricted to users with the **Admin role**. This ensures that only administrators can perform create, update, or delete operations.
- **[Authorize] Attribute**: Protects endpoints so only authenticated users can access them. The `[Authorize(Roles = "Admin")]` attribute is used to enforce role-based access.

### Error Handling

- **NotFound**: Returns a 404 status code if a requested resource does not exist.
- **BadRequest**: Returns a 400 status code for invalid data or failed operations.
- **NoContent**: Returns a 204 status code on successful deletion, indicating the resource no longer exists.

### Data Transfer Objects (DTOs)

For each entity, we use **DTOs** to:
- **Encapsulate data** sent and received by the client.
- **Control which fields** are exposed (e.g., `UserDto`, `ReservationDto`).
- **Simplify data transformations** using **AutoMapper**.

### Repository Pattern

The repository pattern abstracts the data access layer and simplifies unit testing by allowing dependency injection of repositories into controllers.

#### Example Repository for `Model`:
```csharp
public class ModelRepository : IModelRepository
{
    private readonly ApplicationDbContext _context;

    public ModelRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Model>> GetAllAsync()
    {
        return await _context.Models.ToListAsync();
    }

    public async Task<Model> GetByIdAsync(long id)
    {
        return await _context.Models.FindAsync(id);
    }

    public async Task AddAsync(Model model)
    {
        await _context.Models.AddAsync(model);
        await _context.SaveChangesAsync();
    }

    // Update and Delete methods follow similar patterns
}
```

---

## Summary

This API includes comprehensive CRUD functionality with strict role-based access control, ensuring that only authorized users can perform sensitive operations. The repository pattern and DTOs improve data management and encapsulation, while ASP.NET Core Identity simplifies user authentication and role management.