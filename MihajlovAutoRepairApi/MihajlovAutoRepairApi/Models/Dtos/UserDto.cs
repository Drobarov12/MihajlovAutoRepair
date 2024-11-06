namespace MihajlovAutoRepairApi.Models.Dtos;

public class UserDto
{
    public long Id { get; set; }
    public string Username { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string? ModelName { get; set; }
}
