using Microsoft.EntityFrameworkCore;
using MihajlovAutoRepairApi.Models;
using MihajlovAutoRepairApi.Models.Dtos;

namespace MihajlovAutoRepairApi.Repository;

public class ReservationRepository : IReservationRepository
{
    private readonly ApplicationDbContext _context;

    public ReservationRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Reservation>> GetAllAsync()
    {
        return await _context.Reservations
            .Include(r => r.User)
            .Include(r => r.Model)
            .Include(r => r.Type)
            .ToListAsync();
    }

    public async Task<IEnumerable<Reservation>> GetAllForUserAsync(long id)
    {
        var reservations = await _context.Reservations
            .Include(r => r.User)
            .Include(r => r.Model)
            .Include(r => r.Type)
            .ToListAsync();

        var filteredReservations = reservations.Where(rez => rez.User.Id == id).ToList();
        return filteredReservations;
    }

    public async Task<Reservation> GetByIdAsync(long id)
    {
        return await _context.Reservations
            .Include(r => r.User)
            .Include(r => r.Model)
            .Include(r => r.Type)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task AddAsync(Reservation reservation)
    {
        await _context.Reservations.AddAsync(reservation);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Reservation reservation)
    {
        _context.Reservations.Update(reservation);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(long id)
    {
        var reservation = await _context.Reservations.FindAsync(id);
        if (reservation != null)
        {
            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteAllFromUserAsync(long id)
    {
        var reservations = _context.Reservations.Where(res => res.UserId == id).ToList();
        reservations.ForEach(res => _context.Reservations.Remove(res));
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ReservationExistsAsync(long id)
    {
        return await _context.Reservations.AnyAsync(e => e.Id == id);
    }
}
