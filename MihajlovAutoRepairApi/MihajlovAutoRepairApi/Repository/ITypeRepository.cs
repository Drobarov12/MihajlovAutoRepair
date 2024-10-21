using Type = MihajlovAutoRepairApi.Models.Type;

namespace MihajlovAutoRepairApi.Repository;

public interface ITypeRepository
{
    Task<IEnumerable<Type>> GetAllAsync();
    Task<Type> GetByIdAsync(long id);
    Task AddAsync(Type type);
    Task UpdateAsync(Type type);
    Task DeleteAsync(long id);
    Task<bool> TypeExistsAsync(long id);
}
