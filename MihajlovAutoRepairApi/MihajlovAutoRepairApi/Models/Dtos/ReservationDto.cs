namespace MihajlovAutoRepairApi.Models.Dtos;

public class ReservationDto
{
    public long Id { get; set; }
    public string Description { get; set; }
    public DateTime DateTime { get; set; }
    public string UserName { get; set; }
    public string UserPhoneNumber { get; set; }
    public string ModelName { get; set; }
    public string TypeName { get; set; }
}
