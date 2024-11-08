using System.ComponentModel.DataAnnotations;

namespace MihajlovAutoRepairApi.Models;

public class Model
{
    [Key]
    public long Id { get; set; }
    [Required]
    public string ModelName { get; set; }
}
