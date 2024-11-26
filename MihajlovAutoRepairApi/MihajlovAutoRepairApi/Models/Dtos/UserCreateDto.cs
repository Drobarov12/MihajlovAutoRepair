namespace MihajlovAutoRepairApi.Models.Dtos;

public class UserCreateDto
{
    public string UserName { get; set; }
    public string PhoneNumber { get; set; }
    public long ModelId { get; set; }
}
