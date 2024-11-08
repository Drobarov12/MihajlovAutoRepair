using AutoMapper;
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
    private readonly IMapper _mapper;

    public ReservationController(IReservationRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    [HttpGet("{id}")]
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

        var reservation = _mapper.Map<Reservation>(dto);
        await _repository.AddAsync(reservation);

        return CreatedAtAction(nameof(GetReservationById), new { id = reservation.Id }, reservation);
    }
    
    [HttpPut("{id}")]
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
        
        var  reservation = _mapper.Map<Reservation>(reservationDto);
        reservation.Id = id;
        
        await _repository.UpdateAsync(reservation);
        
        return NoContent();
    }
    
    [HttpDelete("{id}")]
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
}
