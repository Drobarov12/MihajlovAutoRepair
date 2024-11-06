namespace MihajlovAutoRepairApi.Models.Dtos;

public class UserCreateDto
{
    public string UserName { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string PhoneNumber { get; set; }
    public long ModelId { get; set; }
}
