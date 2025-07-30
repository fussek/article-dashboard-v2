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
            new Article { 
                ArticleNumber = "110010", 
                Name = "Shimano 105 HB-R7000 Front Hub", 
                ArticleCategory = "Hub", 
                BicycleCategory = "Road,Gravel", 
                Material = "Aluminium", 
                LengthInMm = 100, WidthInMm = 50, HeightInMm = 50, NetWeightInGram = 155 
            },
            new Article { 
                ArticleNumber = "120025", 
                Name = "SRAM GX Eagle DUB Crankset", 
                ArticleCategory = "Crank arm", 
                BicycleCategory = "MTB,e-MTB", 
                Material = "Aluminium", 
                LengthInMm = 175, WidthInMm = 40, HeightInMm = 60, NetWeightInGram = 620 
            },
            new Article { 
                ArticleNumber = "130045", 
                Name = "Shimano BB-UN300 Bottom Bracket", 
                ArticleCategory = "Bottom Bracket", 
                BicycleCategory = "City,Trekking", 
                Material = "Steel", 
                LengthInMm = 122, WidthInMm = 40, HeightInMm = 40, NetWeightInGram = 280 
            },
            new Article { 
                ArticleNumber = "140081", 
                Name = "Shimano Deore XT RD-M8100-SGS", 
                ArticleCategory = "Derailleur", 
                BicycleCategory = "MTB,e-MTB,Trekking", 
                Material = "Alloy", 
                LengthInMm = 150, WidthInMm = 80, HeightInMm = 50, NetWeightInGram = 284 
            },
            new Article { 
                ArticleNumber = "150012", 
                Name = "Shimano Ultegra ST-R8000 Shifter", 
                ArticleCategory = "Shifter", 
                BicycleCategory = "Road", 
                Material = "Carbon", 
                LengthInMm = 180, WidthInMm = 50, HeightInMm = 120, NetWeightInGram = 220 
            },
            new Article { 
                ArticleNumber = "160033", 
                Name = "Shimano BL-MT200 Hydraulic Brake Lever", 
                ArticleCategory = "Brake Lever", 
                BicycleCategory = "MTB,City,Trekking", 
                Material = "Aluminium", 
                LengthInMm = 190, WidthInMm = 25, HeightInMm = 90, NetWeightInGram = 145 
            },
            new Article { 
                ArticleNumber = "170077", 
                Name = "SRAM PG-1170 Cassette 11-28", 
                ArticleCategory = "Cassette", 
                BicycleCategory = "Road,Gravel", 
                Material = "Steel", 
                LengthInMm = 140, WidthInMm = 140, HeightInMm = 40, NetWeightInGram = 247 
            },
            new Article { 
                ArticleNumber = "180099", 
                Name = "KMC X11 Bicycle Chain", 
                ArticleCategory = "Chain", 
                BicycleCategory = "Road,MTB,Gravel", 
                Material = "Nickel", 
                LengthInMm = 1500, WidthInMm = 6, HeightInMm = 10, NetWeightInGram = 257 
            },
            new Article { 
                ArticleNumber = "190054", 
                Name = "Selle Italia Model X Saddle", 
                ArticleCategory = "Saddle", 
                BicycleCategory = "Road,Gravel,MTB", 
                Material = "Plastic", 
                LengthInMm = 245, WidthInMm = 145, HeightInMm = 60, NetWeightInGram = 315 
            },
            new Article { 
                ArticleNumber = "200068", 
                Name = "Ritchey Comp Curve Handlebar", 
                ArticleCategory = "Handlebar", 
                BicycleCategory = "Road,Gravel", 
                Material = "Alloy", 
                LengthInMm = 420, WidthInMm = 128, HeightInMm = 73, NetWeightInGram = 300 
            }
        };

        context.Articles.AddRange(articles);
        context.SaveChanges();
    }
}
