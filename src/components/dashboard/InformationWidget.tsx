import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { allBlogPosts } from "@/data/blog";

export function InformationWidget() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Hämta de 2 senaste interna inläggen som är publicerade
  const internalPosts = allBlogPosts
    .filter((post) => post.internalOnly && post.status === "Publicerad")
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, 2);

  if (internalPosts.length === 0) {
    return null;
  }

  return (
    <Card className="border-l-4 border-l-purple-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-purple-500" />
          Intern information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {internalPosts.map((post) => (
          <div
            key={post.id}
            className="p-3 bg-muted/30 rounded-md space-y-2 hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => navigate("/blogg")}
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-medium text-sm line-clamp-2">{post.title}</h4>
              {!post.isRead && (
                <Badge
                  variant="outline"
                  className="bg-[#FEC6A1] text-amber-700 border-amber-300 shrink-0"
                >
                  Ny
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{post.author}</span>
              <span>•</span>
              <span>{post.date}</span>
            </div>
          </div>
        ))}

        <Button
          variant="ghost"
          className="w-full justify-between hover:bg-muted/50"
          onClick={() => navigate("/blogg")}
        >
          <span>Se alla inlägg</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
