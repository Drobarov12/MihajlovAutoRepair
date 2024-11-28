namespace MihajlovAutoRepairApi.Models.Dtos;

public class UserDto
{
    public long Id { get; set; }
    public string Username { get; set; }
    public string PhoneNumber { get; set; }
    public string? ModelName { get; set; }
    public string? UserRole { get; set; }
}
