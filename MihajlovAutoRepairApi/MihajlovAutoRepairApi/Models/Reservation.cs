using System.ComponentModel.DataAnnotations;

namespace MihajlovAutoRepairApi.Models;

public class Reservation
{
    [Key]
    public long Id { get; set; }
    [Required]
    public long UserId { get; set; }
    [Required]
    public long ModelId { get; set; }
    [Required]
    public long TypeId { get; set; }
    public string Description { get; set; }
    [Required]
    public DateTime DateTime { get; set; }

    // Navigation properties
    public User User { get; set; }
    public Model Model { get; set; }
    public Type Type { get; set; }
}
