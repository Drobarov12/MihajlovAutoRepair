using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MihajlovAutoRepairApi.Models;
using Type = MihajlovAutoRepairApi.Models.Type;

namespace MihajlovAutoRepairApi.Repository;

public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<long>, long>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Reservation> Reservations { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Model> Models { get; set; }
    public DbSet<Type> Types { get; set; }
}