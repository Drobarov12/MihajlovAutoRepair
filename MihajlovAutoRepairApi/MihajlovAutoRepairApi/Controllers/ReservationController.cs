using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MihajlovAutoRepairApi.Models;
using MihajlovAutoRepairApi.Models.Dtos;
using MihajlovAutoRepairApi.Repository;

namespace MihajlovAutoRepairApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReservationController : ControllerBase
{
    private readonly IReservationRepository _repository;
    private readonly ITypeRepository _typeRepository;
    private readonly IModelRepository _modelRepository;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public ReservationController(IReservationRepository repository, ITypeRepository typeRepository,
        IModelRepository modelRepository, IUserRepository userRepository, IMapper mapper)
    {
        _repository = repository;
        _typeRepository = typeRepository;
        _modelRepository = modelRepository;
        _userRepository = userRepository;
        _mapper = mapper;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<ReservationDto>>> GetAllReservations()
    {
        var reservations = await _repository.GetAllAsync();

        if (reservations == null || !reservations.Any())
        {
            return NotFound("No reservations found.");
        }

        var reservationDto = _mapper.Map<List<ReservationDto>>(reservations);
        return Ok(reservationDto);
    }
    
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

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ReservationDto>> GetReservationById(long id)
    {
        var reservation = await _repository.GetByIdAsync(id);
        if (reservation == null)
        {
            return NotFound();
        }

        var reservationDto = _mapper.Map<ReservationDto>(reservation);
        return Ok(reservationDto);
    }

    [HttpPost]
    public async Task<IActionResult> CreateReservation([FromBody] ReservationCreateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Handle guest users
        User user;
        var userId = dto.UserId;
        if (userId == null || userId == 0)
        {
            var guestUser = new User
            {
                Name = dto.Username,
                Email = dto.Username,
                ModelId = dto.ModelId
            };

            await _userRepository.AddAsync(guestUser);

            userId = guestUser.Id;
            user = guestUser;
        }
        else
        {
            user = await _userRepository.GetByIdAsync(userId);
            if (user is not null)
            {
                user.ModelId = dto.ModelId;
                await _userRepository.UpdateAsync(user);
            }
        }

        var reservation = _mapper.Map<Reservation>(dto);
        reservation.User = user;
        reservation.UserId = userId;

        await _repository.AddAsync(reservation);

        return CreatedAtAction(nameof(GetReservationById), new { id = reservation.Id }, reservation);
    }
    
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateReservation(long id, [FromBody] ReservationDto reservationDto)
    {
        if (id != reservationDto.Id)
        {
            return BadRequest();
        }

        var exists = await _repository.ReservationExistsAsync(id);
        if (!exists)
        {
            return NotFound();
        }

        var reservation = _mapper.Map<Reservation>(reservationDto);
        reservation.Id = id;
        
        var user = await _userRepository.GetByUsernameAsync(reservationDto.UserName);
        reservation.User = user;
        reservation.UserId = user.Id;

        reservation = await SetReservationInfo(reservation, reservationDto);

        await _repository.UpdateAsync(reservation);

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteReservation(long id)
    {
        var userExists = await _repository.ReservationExistsAsync(id);
        if (!userExists)
        {
            return NotFound();
        }

        await _repository.DeleteAsync(id);
        return NoContent();
    }
    
    private async Task<Reservation> SetReservationInfo(Reservation reservation, ReservationDto reservationDto)
    {
        var model = await _modelRepository.GetByNameAsync(reservationDto.ModelName);
        reservation.Model = model;
        reservation.ModelId = model.Id;

        var type = await _typeRepository.GetByNameAsync(reservationDto.TypeName);
        reservation.Type = type;
        reservation.TypeId = type.Id;

        return reservation;
    }
}