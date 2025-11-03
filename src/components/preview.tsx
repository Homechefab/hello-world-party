import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ButtonPreview = () => <Button>Click me</Button>;
ButtonPreview.tags = ['button', 'interaction'];

export const CardPreview = () => (
  <Card className="p-4">
    <h3>Card Title</h3>
    <p>Card content goes here</p>
  </Card>
);
CardPreview.tags = ['card', 'container'];

export const InputPreview = () => (
  <div className="grid w-full max-w-sm items-center gap-1.5">
    <Label htmlFor="email">Email</Label>
    <Input type="email" id="email" placeholder="Email" />
  </div>
);
InputPreview.tags = ['input', 'form'];