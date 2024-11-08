using System.ComponentModel.DataAnnotations;

namespace MihajlovAutoRepairApi.Models.Dtos;

public class RegisterDto
{
    [Required]
    public string PhoneNumber { get; set; }
    
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [DataType(DataType.Password)]
    public string Password { get; set; }
}