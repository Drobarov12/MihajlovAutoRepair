# Документација за функционалност CRUD

## Преглед

MihajlovAutoRepairApi обезбедува CRUD операции за управување со ентитети како што се **Users**, **Reservations**, **Models** и **Types**. Секоја операција е достапна преку одредени крајни точки, со **различни привилегии** спроведено за одредени дејства. Администраторите имаат можност да извршуваат чувствителни операции како создавање, ажурирање или бришење ентитети.

Операциите CRUD беа имплементирани со помош на **Entity Framework Core** со **ASP.NET Core** и **ASP.NET Identity** за управување со дозволите.

---

## Општа структура на операциите на CRUD

Секој ентитет има свој контролер со стандардни CRUD крајни точки:
1. **Create**: Додава нов запис во базата на податоци.
2. **Read**: Повлекува една или повеќе записи.
3. **Update**: Изменува постоечки запис.
4. **Delete**: Отстранува запис од базата на податоци.

### Контрола на пристап заснована на привилегии

Пристапот заснован на привилегии се имплементира со користење на `ASP.NET Core Identity`. За чувствителни операции (како `Креирај`, `Ажурирај` и `Избриши`), го користевме атрибутот `[Authorize(Roles = „Admin“)]` за да се осигураме дека само администраторите можат да ги извршуваат овие дејства.

---

## Операции CRUD за секој ентитет

### 1. Ентитет на `User`

Ентитетот `User` се управува преку `AccountController` за регистрација и најавување, но операциите на CRUD за управување со корисници (како добивање на сите корисници или ажурирање корисник) може да се направат преку `UserController`.

#### Акции на кориснички контролер

1. **Земи ги сите корисници**: Враќа листа на сите корисници.
 - **Крајна точка**: `GET /api/User`
 - **Пристап**: Само администратор.

  ```csharp
   [Authorize(Roles = "Admin")]
   [HttpGet]
   public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
   {
       var users = await _userManager.Users.ToListAsync();
       return Ok(users.Select(u => new UserDto(u)));
   }
   ```

2. **Земи корисник по ID**: Повлекува одреден корисник по ID.
 - **Крајна точка**: `GET /api/User/{id}`
 - **Пристап**: Само администратор.

3. **Креирај корисник**: Се прави преку крајната точка за регистрација во `AccountController`.

4. **Ажурирај корисник**: Овозможува ажурирање на корисничките информации.
 - **Крајна точка**: `PUT /api/User/{id}`
 - **Пристап**: Само администратор.

5. **Избриши корисник**: Бришење корисничка сметка.
 - **Крајна точка**: `Delete /api/User/{id}`
 - **Пристап**: Само администратор.

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

### 2. Ентитет на `Reservation`

Ентитетот `Reservation` им овозможува на корисниците да креираат и управуваат со резервации. Само администраторите можат да вршат операции за ажурирање и бришење.

#### Дејства на контролорот на резервација

1. **Земи ги сите резервации**: Ги наведува сите резервации во системот.
 - **Крајна точка**: `Get /api/Reservation`
 - **Пристап**: Само администратор.

  ```csharp
   [Authorize]
   [HttpGet]
   public async Task<ActionResult<IEnumerable<ReservationDto>>> GetReservations()
   {
       var reservations = await _reservationRepository.GetAllAsync();
       return Ok(reservations);
   }
   ```

2. **Земи ги сите според овој корисник**: Ги зема сите резервации за одреден најавен корисник.
 - **Крајна точка**: `GET /api/Reservation/user/{id}`
 - **Пристап**: Сите најавени корисници.

```csharp
    [HttpGet("user/{id}")]
    [Authorize]
    public async Task<ActionResult<List<ReservationDto>>> GetAllUserReservations(long id)
    {
        var reservations = await _repository.GetAllForUserAsync(id);

        if (reservations == null || !reservations.Any())
        {
            return NotFound("No reservations found.");
        }

        var reservationDto = _mapper.Map<List<ReservationDto>>(reservations);
        return Ok(reservationDto);
    }
```

3. **Добијте резервација со ID**: Повлекува одредена резервација со ID.
 - **Крајна точка**: `GET /api/Reservation/{id}`
 - **Пристап**: Само администратор.

4. **Креирај резервација**: Додава нова резервација.
 - **Крајна точка**: `POST /api/Reservation`
 - **Пристап**: Јавен (не е потребно овластување).

5. **Ажурирај ја резервацијата**: Изменува постоечка резервација.
 - **Крајна точка**: `PUT /api/Reservation/{id}`
 - **Пристап**: Само администратор.

6. **Избриши резервација**: Отстранува резервација.
 - **Крајна точка**: `Delete /api/Reservation/{id}`
 - **Пристап**: Само администратор.

### 3. Ентитетот на `Model`

Ентитетот `Model` се користи за управување со различни модели достапни во системот. Ова може да претставува одредена ставка или тип.

#### Акции на контролорот на моделот

1. **Земи ги сите модели**: Ги наведува сите модели.
 - **Крајна точка**: `GET /api/Model`
 - **Пристап**: Јавно.

2. **Get Model by ID**: Враќање на одреден модел по ID.
 - **Крајна точка**: `GET /api/Model/{id}`
 - **Пристап**: Јавно.

3. **Креирај модел**: Додава нов модел во базата на податоци.
 - **Крајна точка**: `POST /api/Model`
 - **Пристап**: Само администратор.

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

4. **Ажурирај го моделот**: Модифицира постоечки модел.
 - **Крајна точка**: `PUT /api/Model/{id}`
 - **Пристап**: Само администратор.

5. **Избриши модел**: Бришење модел.
 - **Крајна точка**: `Delete /api/Model/{id}`
 - **Пристап**: Само администратор.

### 4. Ентитетот `Type`.

`Type` ентитет претставува различни типови или категории.

#### TypeController Actions

1. **Земи ги сите типови**: Ги презема сите типови.
 - **Крајна точка**: `GET /api/Type`
 - **Пристап**: Јавно.

2. **Земи го типот со ID**: Повлекува одреден тип по ID.
 - **Крајна точка**: `GET /api/Type/{id}`
 - **Пристап**: Јавно.

3. **Креирај тип**: Додава нов тип.
 - **Крајна точка**: `POST /api/Type`
 - **Пристап**: Само администратор.

4. **Ажурирај тип**: Ги ажурира деталите за типот.
 - **Крајна точка**: `PUT /api/Type/{id}`
 - **Пристап**: Само администратор.

5. **Бришење на тип**: Отстранува тип.
 - **Крајна точка**: `ИЗБРИШИ /api/Type/{id}`
 - **Пристап**: Само администратор.

---

## Како функционираат операциите на CRUD

### Овластување

- **Крајни точки само за администратор**: одредени крајни точки, како што се `POST`, `PUT` и `DELETE` за сите ентитети, се ограничени на корисници со **административна привилегија**. Ова осигурува дека само администраторите можат да вршат операции за креирање, ажурирање или бришење.
- **[Authorize] атрибут**: Ги заштитува крајните точки така што само автентицираните корисници можат да пристапат до нив. Атрибутот `[Authorize(Roles = "Admin")]` се користи за да се спроведе пристап заснован на привилегии.

### Ракување со грешки

- **NotFound**: Враќа статусен код 404 ако бараниот ресурс не постои.
- **BadRequest**: враќа статусен код од 400 за неважечки податоци или неуспешни операции.
- **NoContent**: враќа статусен код 204 при успешно бришење, што покажува дека ресурсот повеќе не постои.

### Објекти за пренос на податоци (DTO)

За секој ентитет, ние користиме **DTO** за да:
- **Капсулирајте ги податоците** испратени и примени од клиентот.
- **Контролирајте кои полиња** се изложени (на пр., `UserDto`, `ReservationDto`).
- **Поедноставете ги трансформациите на податоци** користејќи **AutoMapper**.

### Шема на складиште

Шаблонот на репозиториум го апстрахира слојот за пристап до податоци и го поедноставува тестирањето на единицата со тоа што дозволува вбризгување на зависност на складиштата во контролорите.

#### Пример Репозиториум за `Model`:
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

## Резиме

Овој API вклучува сеопфатна CRUD функционалност со строга контрола на пристап заснована на улоги, осигурувајќи дека само овластените корисници можат да вршат чувствителни операции. Шаблонот на складиштето и DTO го подобруваат управувањето со податоците и енкапсулацијата, додека ASP.NET Core Identity ја поедноставува автентикацијата на корисникот и управувањето со улогите.


# API документација за автентикација

## Преглед

MihajlovAutoRepairApi користи **ASP.NET Core Identity** со **JWT (JSON Web Tokens)** за безбедна автентикација. Корисниците се регистрираат со нивната е-пошта и лозинка, се најавуваат за да добијат токен JWT и го користат тој токен за пристап до заштитените крајни точки на API.

### Компоненти
- **ASP.NET Core Identity** за управување со корисници и улоги.
- **JWT** за автентикација базирана на токени.

---

## Поставување и конфигурација чекор-по-чекор

### 1. Поставување `ApplicationDbContext` со ASP.NET Core Identity

Создадовме класа `ApplicationDbContext`, која наследува од `IdentityDbContext<User, IdentityRole<long>, long>`. Ова ни овозможи да користиме `long` како примарен тип на клуч и за корисниците и за улогите.

#### Код:
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

### 2. Регистрирање на идентитет и JWT во `Program.cs`

Додадовме услуги за **ASP.NET Core Identity** и конфигуриравме **автентикација базирана на JWT** во `Program.cs`.

#### Код:
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

### 3. Генерирање безбеден JWT клуч и конфигурирање на `appsettings.json`

За клучот за потпишување JWT, генериравме безбеден клуч од 32 знаци за да се осигураме дека ги исполнува безбедносните барања. Го додадовме овој клуч заедно со вредностите на издавачот и публиката во `appsettings.json` само за `Development`, но за дистрибуција на апликацијата ги земаме овие вредности од околината ови вредности, и никогаш не треба `appsettings.json` да биде јавно ставено некаде.

#### Конфигурација на `appsettings.json`:
```json
{
  "Jwt": {
    "Key": "`==key==", // A secure key we generated
    "Issuer": "localhost",
    "Audience": "localhost",
    "ExpiryInMinutes": 60
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=db;Username=myuser;Password=mypassword"
  }
}
```

### 4. Регистрација на корисникот и најава во `AccountController`

Создадовме крајни точки за регистрација на корисникот и најавување во `AccountController`. 

#### Крајна точка за регистрација на корисници:
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

#### Крајна точка за најава на корисникот:
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

### 5. Метод за генерирање на токени JWT

Спроведовме метод на `GenerateJwtToken` за создавање JWT токени при успешно најавување.

#### Генерирај код на JwtToken:
```csharp
private string GenerateJwtToken(ApplicationUser user)
{
    var claims = new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Email),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_KEY") ?? _configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: Environment.GetEnvironmentVariable("JWT_ISSUER") ?? _configuration["Jwt:Issuer"],
            audience: Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(Convert.ToDouble(Environment.GetEnvironmentVariable("JWT_EXPIRYINMINUTES") ?? 
            _configuration["Jwt:ExpiryInMinutes"])),
            signingCredentials: creds);

    return new JwtSecurityTokenHandler().WriteToken(token);
}
```

### 6. Заштита на крајните точки со `[Authorize]`

Обезбедивме специфични крајни точки со атрибутот `[Authorize]`. 
#### Пример за заштитена крајна точка:
```csharp
[Authorize]
[HttpGet("secure-endpoint")]
public IActionResult SecureEndpoint()
{
    return Ok("You have accessed a protected endpoint!");
}
```

### 7. Тестирање и решавање проблеми

Во текот на имплементацијата наидовме и решивме неколку прашања:
- **401 неовластени грешки**: тие најчесто се должат на недостиг на префикси на `Bearer` или истечени токени.
- **Грешка во JWT не добто формулуран**: оваа грешка се појави кога токените беа неправилно форматирани. Го потврдивме генерирањето токени користејќи [jwt.io](https://jwt.io/) за да ги провериме заглавието, главниот дел и потписот.

### Финален работен тек

1. **Регистрација на корисници**: Корисниците се регистрираат со нивната е-пошта и лозинка преку крајната точка `/регистрирај се`.
2. **Корисничко најавување**: Корисниците се најавуваат преку крајната точка `/login` за да добијат JWT токен.
3. **Пристап до заштитени крајни точки**: токенот е вклучен во заглавието „Authorization: Bearer <token>“ кога се пристапува до крајните точки со „[Authorize]“.
4. **Валидација на токен**: Серверот го потврдува потписот на токенот, издавачот, публиката и датумот на истекување, давајќи или одбивајќи пристап врз основа на овие проверки.

---

## Резиме

Ова поставување обезбедува безбеден и скалабилен систем за автентикација за API користејќи ASP.NET Core Identity и JWT. Следејќи ги овие чекори, го конфигуриравме Identity со PostgreSQL, генериравме безбедни JWT токени и заштитени крајни точки со `[Authorize]`. API сега е подготвен за корисниците да се регистрираат, да се логираат и да пристапуваат до заштитените ресурси користејќи автентикација базирана на JWT.