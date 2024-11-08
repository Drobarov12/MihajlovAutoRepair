using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using Microsoft.AspNetCore.Identity;

namespace MihajlovAutoRepairApi.Models;

public class User : IdentityUser<long>
{
    public string Name { get; set; }
    public long ModelId { get; set; }

    // Navigation properties
    [NotMapped]
    public ICollection<Model> Model { get; set; } 
    [NotMapped]
    public ICollection<Reservation> Reservations { get; set; }
}