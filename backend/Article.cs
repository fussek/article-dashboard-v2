using System.ComponentModel.DataAnnotations;

public class Article
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public string ArticleNumber { get; set; }
    public string Name { get; set; }
    public string ArticleCategory { get; set; }
    public string BicycleCategory { get; set; }
    public string Material { get; set; }
    public int LengthInMm { get; set; }
    public int WidthInMm { get; set; }
    public int HeightInMm { get; set; }
    public int NetWeightInGram { get; set; }
}