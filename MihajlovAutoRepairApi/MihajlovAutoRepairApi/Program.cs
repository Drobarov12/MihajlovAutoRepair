using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MihajlovAutoRepairApi.Models;
using MihajlovAutoRepairApi.Repository;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    string connectionString = null;
    if (Environment.GetEnvironmentVariable("DB_HOST") is not null)
    {
        connectionString = $"Host={Environment.GetEnvironmentVariable("DB_HOST")};" +
                           $"Database={Environment.GetEnvironmentVariable("DB_NAME")};" +
                           $"Username={Environment.GetEnvironmentVariable("DB_USER")};" +
                           $"Password={Environment.GetEnvironmentVariable("DB_PASSWORD")}";
    }
    options.UseNpgsql(connectionString ??
                      builder.Configuration.GetConnectionString("DefaultConnection"));
});
        

builder.Services.AddIdentity<User, IdentityRole<long>>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

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
            ValidIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? builder.Configuration["Jwt:Issuer"],
            ValidAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_KEY") ?? builder.Configuration["Jwt:Key"]))
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine("Authentication failed: " + context.Exception.Message);
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("Token validated for " + context.Principal.Identity.Name);
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IReservationRepository, ReservationRepository>();
builder.Services.AddScoped<ITypeRepository, TypeRepository>();
builder.Services.AddScoped<IModelRepository, ModelRepository>();

builder.Services.AddAutoMapper(typeof(Program));
// Add services to the container.

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        var allowedOrigins = Environment.GetEnvironmentVariable("ALLOWED_ORIGINS")?.Split(",") 
                             ?? new[] { "http://localhost:3000" };

        policy.WithOrigins(allowedOrigins)
            .AllowAnyMethod()
            .WithHeaders("Authorization", "Content-Type")
            .AllowCredentials();
    });
       
});


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole<long>>>();
    var userManager = services.GetRequiredService<UserManager<User>>();

    await SeedRolesAndUsersAsync(roleManager, userManager);

    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.EnsureCreated(); // Ensure the database is created

    // File path to the JSON file
    var filePath = Path.Combine(AppContext.BaseDirectory, "bmw_models.json");
    DbSeeder.SeedFromFile(context, filePath);
}

app.UseCors("AllowLocalhost");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

async Task SeedRolesAndUsersAsync(RoleManager<IdentityRole<long>> roleManager, UserManager<User> userManager)
{
    var roles = new[] { "User", "Admin" };

    // Ensure roles exist
    foreach (var role in roles)
    {
        try
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole<long> { Name = role });
            }
        }
        catch (Exception e)
        {
            await roleManager.CreateAsync(new IdentityRole<long> { Name = role });
        }
        
    }

    // Seed an admin user (optional)
    var adminEmail = "admin@example.com";
    var adminPassword = "Admin123!";

    if (await userManager.FindByEmailAsync(adminEmail) == null)
    {
        var adminUser = new User
        {
            Name = adminEmail,
            UserName = adminEmail,
            Email = adminEmail,
            EmailConfirmed = true
        };

        var result = await userManager.CreateAsync(adminUser, adminPassword);
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }
    }
}