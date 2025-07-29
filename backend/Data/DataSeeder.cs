using System.Linq;
using backend.Data;

public static class DataSeeder
{
    public static void Seed(ApiDbContext context)
    {
        if (context.Articles.Any())
        {
            return;
        }

        var articles = new Article[]
        {
            new Article { ArticleNumber = "100291", Name = "e-Cargo bike hub speed 10x", ArticleCategory = "Hub", BicycleCategory = "e-Cargo bike", Material = "Aluminium", LengthInMm = 110, WidthInMm = 100, HeightInMm = 20, NetWeightInGram = 210 },
            new Article { ArticleNumber = "100292", Name = "Road hub flex", ArticleCategory = "Hub", BicycleCategory = "Road", Material = "Steel", LengthInMm = 100, WidthInMm = 90, HeightInMm = 20, NetWeightInGram = 300 },
            new Article { ArticleNumber = "100293", Name = "Gravel hub speed pro", ArticleCategory = "Hub", BicycleCategory = "Gravel,e-Gravel", Material = "Alloy", LengthInMm = 90, WidthInMm = 80, HeightInMm = 30, NetWeightInGram = 120 },
            new Article { ArticleNumber = "100294", Name = "e-Trekking hub speed flex", ArticleCategory = "Hub", BicycleCategory = "e-Trekking", Material = "Carbon", LengthInMm = 130, WidthInMm = 80, HeightInMm = 20, NetWeightInGram = 200 },
            new Article { ArticleNumber = "100295", Name = "e-City cranks vario", ArticleCategory = "Crank arm", BicycleCategory = "e-City,e-Trekking", Material = "Aluminium", LengthInMm = 170, WidthInMm = 10, HeightInMm = 30, NetWeightInGram = 100 },
            new Article { ArticleNumber = "100296", Name = "Road cranks vario 4", ArticleCategory = "Crank arm", BicycleCategory = "Road", Material = "Alloy", LengthInMm = 200, WidthInMm = 15, HeightInMm = 20, NetWeightInGram = 110 },
            new Article { ArticleNumber = "100297", Name = "Fold crank 5", ArticleCategory = "Crank arm", BicycleCategory = "Foldable", Material = "Nickel", LengthInMm = 150, WidthInMm = 10, HeightInMm = 20, NetWeightInGram = 350 }
        };

        context.Articles.AddRange(articles);
        context.SaveChanges();
    }
}
