using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MihajlovAutoRepairApi.Models;
using MihajlovAutoRepairApi.Models.Dtos;
using MihajlovAutoRepairApi.Repository;

namespace MihajlovAutoRepairApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ModelController : ControllerBase
{
     private readonly IModelRepository _repository;
    private readonly IMapper _mapper;

    public ModelController(IModelRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    // GET: api/Models
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ModelDto>>> GetModels()
    {
        var models = await _repository.GetAllAsync();
        var modelDtos = _mapper.Map<IEnumerable<ModelDto>>(models);
        return Ok(modelDtos);
    }

    // GET: api/Model/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ModelDto>> GetModelById(long id)
    {
        var model = await _repository.GetByIdAsync(id);

        if (model == null)
        {
            return NotFound();
        }

        var modelDto = _mapper.Map<ModelDto>(model);
        return Ok(modelDto);
    }

    // POST: api/Model
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateModel([FromBody] ModelCreateDto modelCreateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var model = _mapper.Map<Model>(modelCreateDto);
        await _repository.AddAsync(model);

        var modelDto = _mapper.Map<ModelDto>(model);
        return CreatedAtAction(nameof(GetModelById), new { id = modelDto.Id }, modelDto);
    }

    // PUT: api/Model/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateModel(long id, [FromBody] ModelCreateDto modelCreateDto)
    {
        if (!ModelState.IsValid || id == 0)
        {
            return BadRequest(ModelState);
        }

        var modelExists = await _repository.ModelExistsAsync(id);
        if (!modelExists)
        {
            return NotFound();
        }

        var model = _mapper.Map<Model>(modelCreateDto);
        model.Id = id;

        await _repository.UpdateAsync(model);

        return Ok(id);
    }

    // DELETE: api/Model/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteModel(long id)
    {
        var modelExists = await _repository.ModelExistsAsync(id);
        if (!modelExists)
        {
            return NotFound();
        }

        await _repository.DeleteAsync(id);
        return Ok(id);
    }
}