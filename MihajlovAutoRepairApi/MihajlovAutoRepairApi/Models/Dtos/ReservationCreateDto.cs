namespace MihajlovAutoRepairApi.Models.Dtos;

public class ReservationCreateDto
{
    public long UserId { get; set; }
    public string Username { get; set; }
    public long ModelId { get; set; }
    public long TypeId { get; set; }
    public string Description { get; set; }
    public DateTime DateTime { get; set; }
}
