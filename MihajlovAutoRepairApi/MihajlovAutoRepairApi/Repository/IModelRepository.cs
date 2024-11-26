using MihajlovAutoRepairApi.Models;

namespace MihajlovAutoRepairApi.Repository;

public interface IModelRepository
{
    Task<IEnumerable<Model>> GetAllAsync();
    Task<Model> GetByIdAsync(long id);
    Task<Model> GetByNameAsync(string name);
    Task AddAsync(Model type);
    Task UpdateAsync(Model type);
    Task DeleteAsync(long id);
    Task<bool> ModelExistsAsync(long id);
}