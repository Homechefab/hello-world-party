import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ThumbsUp, Reply, Search, Send, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = ["Allmänt", "Recept", "Logistik", "Hygien", "Tips & Tricks"];

const ChefForum = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("Allmänt");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  // Check auth
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  // Fetch posts with author names
  const { data: posts, isLoading } = useQuery({
    queryKey: ["forum-posts", searchTerm],
    queryFn: async () => {
      let query = supabase
        .from("forum_posts")
        .select("id, user_id, title, content, category, likes_count, replies_count, created_at")
        .order("created_at", { ascending: false });

      if (searchTerm.trim()) {
        const sanitized = searchTerm.replace(/%/g, '\\%').replace(/_/g, '\\_');
        query = query.or(`title.ilike.%${sanitized}%,content.ilike.%${sanitized}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch author names
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map((p) => p.user_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", userIds);

        const profileMap = new Map(profiles?.map((p) => [p.id, p.full_name]) || []);
        return data.map((post) => ({
          ...post,
          author_name: profileMap.get(post.user_id) || "Anonym",
        }));
      }
      return data || [];
    },
    enabled: !!session,
  });

  // Fetch replies for expanded post
  const { data: replies } = useQuery({
    queryKey: ["forum-replies", expandedPost],
    queryFn: async () => {
      if (!expandedPost) return [];
      const { data, error } = await supabase
        .from("forum_replies")
        .select("*")
        .eq("post_id", expandedPost)
        .order("created_at", { ascending: true });
      if (error) throw error;

      if (data && data.length > 0) {
        const userIds = [...new Set(data.map((r) => r.user_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", userIds);
        const profileMap = new Map(profiles?.map((p) => [p.id, p.full_name]) || []);
        return data.map((reply) => ({
          ...reply,
          author_name: profileMap.get(reply.user_id) || "Anonym",
        }));
      }
      return data || [];
    },
    enabled: !!expandedPost && !!session,
  });

  // Fetch user likes
  const { data: userLikes } = useQuery({
    queryKey: ["forum-user-likes"],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data } = await supabase
        .from("forum_likes")
        .select("post_id, reply_id")
        .eq("user_id", session.user.id);
      return data || [];
    },
    enabled: !!session,
  });

  // Create post
  const createPost = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) throw new Error("Ej inloggad");
      const { error } = await supabase.from("forum_posts").insert({
        user_id: session.user.id,
        title: newPostTitle.trim(),
        content: newPostContent.trim(),
        category: newPostCategory,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostCategory("Allmänt");
      setDialogOpen(false);
      toast.success("Inlägget publicerades!");
    },
    onError: () => toast.error("Kunde inte skapa inlägget"),
  });

  // Create reply
  const createReply = useMutation({
    mutationFn: async (postId: string) => {
      if (!session?.user?.id) throw new Error("Ej inloggad");
      const { error } = await supabase.from("forum_replies").insert({
        post_id: postId,
        user_id: session.user.id,
        content: replyContent.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-replies"] });
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
      setReplyContent("");
      toast.success("Svar publicerat!");
    },
    onError: () => toast.error("Kunde inte skicka svaret"),
  });

  // Toggle like
  const toggleLike = useMutation({
    mutationFn: async ({ postId, replyId }: { postId?: string; replyId?: string }) => {
      if (!session?.user?.id) throw new Error("Ej inloggad");
      const existingLike = userLikes?.find(
        (l) => (postId && l.post_id === postId) || (replyId && l.reply_id === replyId)
      );

      if (existingLike) {
        const { error } = await supabase
          .from("forum_likes")
          .delete()
          .eq("user_id", session.user.id)
          .eq(postId ? "post_id" : "reply_id", postId || replyId!);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("forum_likes").insert({
          user_id: session.user.id,
          post_id: postId || null,
          reply_id: replyId || null,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-user-likes"] });
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
      queryClient.invalidateQueries({ queryKey: ["forum-replies"] });
    },
  });

  const hasLikedPost = (postId: string) =>
    userLikes?.some((l) => l.post_id === postId) || false;

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 py-8">
          <Button variant="outline" onClick={() => navigate("/seller-guide")} className="mb-6">
            ← Tillbaka till Säljarguiden
          </Button>
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                  <MessageCircle className="w-8 h-8 text-primary" />
                  Kockforum
                </CardTitle>
                <CardDescription>
                  Anslut dig till vårt community av hemmakockar. Dela erfarenheter, ställ frågor och lär av varandra.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageCircle className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Logga in för att delta</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    Du behöver vara inloggad för att se och skriva inlägg i forumet.
                  </p>
                  <Button className="bg-gradient-primary" size="lg" onClick={() => navigate("/auth")}>
                    Logga in / Registrera dig
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => navigate("/seller-guide")} className="mb-6">
          ← Tillbaka till Säljarguiden
        </Button>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-3xl">
                <MessageCircle className="w-8 h-8 text-primary" />
                Kockforum
              </CardTitle>
              <CardDescription>
                Dela erfarenheter, ställ frågor och lär av andra kockar i communityn.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Sök i forumet..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-primary">Nytt inlägg</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Skapa nytt inlägg</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                      <Input
                        placeholder="Titel på ditt inlägg..."
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        maxLength={200}
                      />
                      <Select value={newPostCategory} onValueChange={setNewPostCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Textarea
                        placeholder="Skriv ditt inlägg här..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        rows={5}
                        maxLength={5000}
                      />
                      <Button
                        className="w-full bg-gradient-primary"
                        disabled={!newPostTitle.trim() || !newPostContent.trim() || createPost.isPending}
                        onClick={() => createPost.mutate()}
                      >
                        {createPost.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Send className="w-4 h-4 mr-2" />
                        )}
                        Publicera
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : posts && posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <Card
                      key={post.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">{post.category}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(post.created_at), "d MMM yyyy, HH:mm", { locale: sv })}
                              </span>
                            </div>
                            <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                            <CardDescription className="text-sm mb-3 whitespace-pre-wrap">
                              {expandedPost === post.id
                                ? post.content
                                : post.content.length > 150
                                ? post.content.slice(0, 150) + "..."
                                : post.content}
                            </CardDescription>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="font-medium">{(post as { author_name?: string }).author_name}</span>
                              <div className="flex items-center gap-1">
                                <Reply className="w-4 h-4" />
                                <span>{post.replies_count} svar</span>
                              </div>
                              <button
                                className={`flex items-center gap-1 transition-colors ${
                                  hasLikedPost(post.id) ? "text-primary" : "hover:text-primary"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleLike.mutate({ postId: post.id });
                                }}
                              >
                                <ThumbsUp className="w-4 h-4" />
                                <span>{post.likes_count} gilla</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      {expandedPost === post.id && (
                        <CardContent onClick={(e) => e.stopPropagation()}>
                          <div className="border-t pt-4 space-y-3">
                            {replies && replies.length > 0 ? (
                              replies.map((reply) => (
                                <div key={reply.id} className="bg-muted/50 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">
                                      {(reply as { author_name?: string }).author_name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {format(new Date(reply.created_at), "d MMM yyyy, HH:mm", {
                                        locale: sv,
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground text-center py-2">
                                Inga svar ännu. Bli den första!
                              </p>
                            )}

                            <div className="flex gap-2 mt-3">
                              <Input
                                placeholder="Skriv ett svar..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                maxLength={2000}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && replyContent.trim()) {
                                    createReply.mutate(post.id);
                                  }
                                }}
                              />
                              <Button
                                size="icon"
                                disabled={!replyContent.trim() || createReply.isPending}
                                onClick={() => createReply.mutate(post.id)}
                              >
                                {createReply.isPending ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Send className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageCircle className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Inga inlägg ännu</h3>
                  <p className="text-muted-foreground max-w-md">
                    Bli den första att starta en diskussion! Klicka på "Nytt inlägg" för att komma igång.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChefForum;
