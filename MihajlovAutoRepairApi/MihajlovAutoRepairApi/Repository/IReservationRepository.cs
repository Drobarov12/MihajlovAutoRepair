using MihajlovAutoRepairApi.Models;
using MihajlovAutoRepairApi.Models.Dtos;

namespace MihajlovAutoRepairApi.Repository;

public interface IReservationRepository
{
    Task<IEnumerable<Reservation>> GetAllAsync();
    Task<IEnumerable<Reservation>> GetAllForUserAsync(long id);
    Task<Reservation> GetByIdAsync(long id);
    Task AddAsync(Reservation reservation);
    Task UpdateAsync(Reservation reservation);
    Task DeleteAsync(long id);
    Task DeleteAllFromUserAsync(long id);
    Task<bool> ReservationExistsAsync(long id);
}