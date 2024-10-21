using System.ComponentModel.DataAnnotations;

namespace MihajlovAutoRepairApi.Models;

public class Type
{
    [Key]
    public long Id { get; set; }
    [Required]
    public string TypeName { get; set; }
}
