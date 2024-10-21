namespace MihajlovAutoRepairApi.Models.Dtos;

public class UserCreateDto
{
    public string Username { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public int PhoneNumber { get; set; }
    public long ModelId { get; set; }
}
