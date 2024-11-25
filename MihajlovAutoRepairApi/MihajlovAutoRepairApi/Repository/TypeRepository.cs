using Microsoft.EntityFrameworkCore;
using Type = MihajlovAutoRepairApi.Models.Type;

namespace MihajlovAutoRepairApi.Repository;

public class TypeRepository : ITypeRepository
{
    private readonly ApplicationDbContext _context;

    public TypeRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Type>> GetAllAsync()
    {
        return await _context.Types.ToListAsync();
    }

    public async Task<Type> GetByIdAsync(long id)
    {
        return await _context.Types.FindAsync(id);
    }

    public async Task<Type> GetByNameAsync(string name)
    {
        return await _context.Types.FirstOrDefaultAsync(type => type.TypeName == name);
    }

    public async Task AddAsync(Models.Type type)
    {
        await _context.Types.AddAsync(type);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Type type)
    {
        _context.Types.Update(type);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(long id)
    {
        var type = await _context.Types.FindAsync(id);
        if (type != null)
        {
            _context.Types.Remove(type);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> TypeExistsAsync(long id)
    {
        return await _context.Types.AnyAsync(t => t.Id == id);
    }
}
