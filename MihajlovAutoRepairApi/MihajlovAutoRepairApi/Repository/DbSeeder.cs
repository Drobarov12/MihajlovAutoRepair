using MihajlovAutoRepairApi.Models;
using Newtonsoft.Json;

namespace MihajlovAutoRepairApi.Repository;

public static class DbSeeder
{
    public static void SeedFromFile(ApplicationDbContext context, string filePath)
    {
        if (!context.Models.Any())
        {
            var jsonData = File.ReadAllText(filePath);
            var models = JsonConvert.DeserializeObject<List<Model>>(jsonData);
            
            context.Models.AddRange(models);
            context.SaveChanges();
        }
    }
}