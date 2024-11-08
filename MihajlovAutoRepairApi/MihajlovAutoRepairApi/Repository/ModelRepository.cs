using Microsoft.EntityFrameworkCore;
using MihajlovAutoRepairApi.Models;

namespace MihajlovAutoRepairApi.Repository;

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

    public async Task AddAsync(Model type)
    {
        await _context.Models.AddAsync(type);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Model type)
    {
        _context.Models.Update(type);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(long id)
    {
        var type = await _context.Models.FindAsync(id);
        if (type != null)
        {
            _context.Models.Remove(type);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ModelExistsAsync(long id)
    {
        return await _context.Types.AnyAsync(t => t.Id == id);

    }
}