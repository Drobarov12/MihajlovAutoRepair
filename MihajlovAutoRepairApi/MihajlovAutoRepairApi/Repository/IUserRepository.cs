using MihajlovAutoRepairApi.Models;

namespace MihajlovAutoRepairApi.Repository;

public interface IUserRepository
{
    Task<IEnumerable<User>> GetAllAsync();
    Task<User?> GetByIdAsync(long id);
    Task<User?> GetByIdWithModelAsync(long id);
    Task<User> GetByUsernameAsync(string username);
    Task AddAsync(User user);
    Task UpdateAsync(User user);
    Task DeleteAsync(long id);
    Task<bool> UserExistsAsync(long id);
}