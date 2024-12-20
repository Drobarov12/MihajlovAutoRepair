using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MihajlovAutoRepairApi.Models;
using MihajlovAutoRepairApi.Models.Dtos;

namespace MihajlovAutoRepairApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IConfiguration _configuration;

    public AccountController(UserManager<User> userManager, SignInManager<User> signInManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    // POST: api/Account/Register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = new User
            { UserName = model.Email, Email = model.Email, Name = model.Email, PhoneNumber = model.PhoneNumber};
        var result = await _userManager.CreateAsync(user, model.Password);

        if (result.Succeeded)
        {
            await _userManager.AddToRoleAsync(user, "User");
            return Ok("User created successfully");
        }

        return BadRequest(result.Errors);
    }

    // POST: api/Account/Login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);

        if (!result.Succeeded) return Unauthorized();
        
        var user = await _userManager.FindByEmailAsync(model.Email);
        var roleList = await _userManager.GetRolesAsync(user!);
        var role = roleList.FirstOrDefault() ?? "User";
        var token = GenerateJwtToken(user!, role);
            
        // Response.Cookies.Append("AuthToken", token, new CookieOptions // TODO for feature inprovements
        // {
        //     HttpOnly = true,
        //     Secure = false, // Use only HTTPS set to false for debugg
        //     SameSite = SameSiteMode.Strict, // Prevent CSRF
        //     Expires = DateTime.UtcNow.AddMinutes(30)
        // });

        return Ok(new { user = new { user.Id, user.UserName, user.PhoneNumber, user.ModelId }, token, role });
        // return Ok(new { token });

    }

    private string GenerateJwtToken(User user, string role)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.UserName),
            new Claim(ClaimTypes.Role, role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_KEY") ?? _configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: Environment.GetEnvironmentVariable("JWT_ISSUER") ?? _configuration["Jwt:Issuer"],
            audience: Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(Convert.ToDouble(Environment.GetEnvironmentVariable("JWT_EXPIRYINMINUTES") ?? _configuration["Jwt:ExpiryInMinutes"])),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}