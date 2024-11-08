using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MihajlovAutoRepairApi.Models.Dtos;
using MihajlovAutoRepairApi.Repository;
using Type = MihajlovAutoRepairApi.Models.Type;


namespace MihajlovAutoRepairApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TypeController : ControllerBase
{
    private readonly ITypeRepository _repository;
    private readonly IMapper _mapper;

    public TypeController(ITypeRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    // GET: api/Type
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TypeDto>>> GetTypes()
    {
        var types = await _repository.GetAllAsync();
        var typeDtos = _mapper.Map<IEnumerable<TypeDto>>(types);
        return Ok(typeDtos);
    }

    // GET: api/Type/5
    [HttpGet("{id}")]
    public async Task<ActionResult<TypeDto>> GetTypeById(long id)
    {
        var type = await _repository.GetByIdAsync(id);

        if (type == null)
        {
            return NotFound();
        }

        var typeDto = _mapper.Map<TypeDto>(type);
        return Ok(typeDto);
    }

    // POST: api/Type
    [HttpPost]
    public async Task<IActionResult> CreateType([FromBody] TypeCreateDto typeCreateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var type = _mapper.Map<Type>(typeCreateDto);
        await _repository.AddAsync(type);

        var typeDto = _mapper.Map<TypeDto>(type);
        return CreatedAtAction(nameof(GetTypeById), new { id = typeDto.Id }, typeDto);
    }

    // PUT: api/Type/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateType(long id, [FromBody] TypeCreateDto typeCreateDto)
    {
        if (!ModelState.IsValid || id == 0)
        {
            return BadRequest(ModelState);
        }

        var typeExists = await _repository.TypeExistsAsync(id);
        if (!typeExists)
        {
            return NotFound();
        }

        var type = _mapper.Map<Type>(typeCreateDto);
        type.Id = id;

        await _repository.UpdateAsync(type);

        return Ok(id);
    }

    // DELETE: api/Type/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteType(long id)
    {
        var typeExists = await _repository.TypeExistsAsync(id);
        if (!typeExists)
        {
            return NotFound();
        }

        await _repository.DeleteAsync(id);
        return Ok(id);
    }
}
