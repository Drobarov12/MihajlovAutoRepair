using AutoMapper;
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
    private readonly IMapper _mapper;

    public UserController(IUserRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    // GET: api/User
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        var users = await _repository.GetAllAsync();
        var userDtos = _mapper.Map<IEnumerable<UserDto>>(users);
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

        var userExists = await _repository.UserExistsAsync(id);
        if (!userExists)
        {
            return NotFound();
        }

        var user = _mapper.Map<User>(userCreateDto);
        user.Id = id;

        await _repository.UpdateAsync(user);

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

        await _repository.DeleteAsync(id);
        return NoContent();
    }
}
