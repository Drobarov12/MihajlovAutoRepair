using System.ComponentModel.DataAnnotations;

namespace MihajlovAutoRepairApi.Models;

public class User
{
    [Key]
    public long Id { get; set; }
    [Required]
    public string Username { get; set; }
    public string Name { get; set; }
    [Required]
    public string Email { get; set; }
    public string Password { get; set; }
    public int PhoneNumber { get; set; }
    public long ModelId { get; set; }

    // Navigation properties
    public Model Model { get; set; }
    public ICollection<Reservation> Reservations { get; set; }
}
