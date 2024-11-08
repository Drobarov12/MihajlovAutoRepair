using MihajlovAutoRepairApi.Models;

namespace MihajlovAutoRepairApi.Repository;

public interface IReservationRepository
{
    Task<IEnumerable<Reservation>> GetAllAsync();
    Task<Reservation> GetByIdAsync(long id);
    Task AddAsync(Reservation reservation);
    Task UpdateAsync(Reservation reservation);
    Task DeleteAsync(long id);
    Task<bool> ReservationExistsAsync(long id);
}