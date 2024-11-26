using Microsoft.EntityFrameworkCore;
using MihajlovAutoRepairApi.Models;

namespace MihajlovAutoRepairApi.Repository;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<User>> GetAllAsync()
    {
        var users = await _context.Users.ToListAsync();
        users.ForEach(user =>
        {
            if (user.Model == null)
                user.Model = new List<Model>();
            if (user.ModelId == 0 || user.Model.Count > 0) return;
            user.Model.Add(_context.Models.FirstOrDefault(x=> x.Id == user.ModelId));
        });
        return users;
    }

    public async Task<User?> GetByIdAsync(long id)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
    }
    public async Task<User?> GetByIdWithModelAsync(long id)
    {
        return await _context.Users.Include(u => u.Model).FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);
    }

    public async Task AddAsync(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(long id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user != null)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> UserExistsAsync(long id)
    {
        return await _context.Users.AnyAsync(u => u.Id == id);
    }
}
