using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MihajlovAutoRepairApi.Models;
using MihajlovAutoRepairApi.Models.Dtos;
using MihajlovAutoRepairApi.Repository;

namespace MihajlovAutoRepairApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserRepository _repository;
    private readonly IReservationRepository _reservationRepository;
    private readonly UserManager<User> _userManager;
    private readonly IMapper _mapper;

    public UserController(IUserRepository repository, IReservationRepository reservationRepository, UserManager<User> userManager,IMapper mapper)
    {
        _repository = repository;
        _reservationRepository = reservationRepository;
        _userManager = userManager;
        _mapper = mapper;
    }

    // GET: api/User
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        var users = await _repository.GetAllAsync();
        var userDtos = _mapper.Map<List<UserDto>>(users);
        for (int i = 0; i < users.Count; i++)
        {
            var role = await _userManager.GetRolesAsync(users[i]);
            userDtos[i].UserRole = role.LastOrDefault() ?? "";
        }
        return Ok(userDtos);
    }

    // GET: api/User/5
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUserById(long id)
    {
        var user = await _repository.GetByIdAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        var userDto = _mapper.Map<UserDto>(user);
        return Ok(userDto);
    }

    // POST: api/User
    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] UserCreateDto userCreateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = _mapper.Map<User>(userCreateDto);
        await _repository.AddAsync(user);

        var userDto = _mapper.Map<UserDto>(user);
        return CreatedAtAction(nameof(GetUserById), new { id = userDto.Id }, userDto);
    }

    // PUT: api/User/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(long id, [FromBody] UserCreateDto userCreateDto)
    {
        if (!ModelState.IsValid || id == 0)
        {
            return BadRequest(ModelState);
        }

        var user = await _repository.GetByIdAsync(id);
        if (user == null )
        {
            return NotFound();
        }

        user.UserName = userCreateDto.UserName;
        user.PhoneNumber = userCreateDto.PhoneNumber;
        user.ModelId = userCreateDto.ModelId;
        
        await _repository.UpdateAsync(user);

        return NoContent();
    }
    
    [HttpPut("{id}/{role}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUserRole(long id, string role)
    {
        if (!ModelState.IsValid || id == 0)
        {
            return BadRequest(ModelState);
        }

        var user = await _repository.GetByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);
        
        await _userManager.AddToRoleAsync(user, role);

        return NoContent();
    }

    // DELETE: api/User/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(long id)
    {
        var userExists = await _repository.UserExistsAsync(id);
        if (!userExists)
        {
            return NotFound();
        }

        await _reservationRepository.DeleteAllFromUserAsync(id);
        await _repository.DeleteAsync(id);
        return NoContent();
    }
}
