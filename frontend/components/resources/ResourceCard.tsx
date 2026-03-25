"use client";

import { HiCircleStack, HiArrowTopRightOnSquare } from "react-icons/hi2";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import type { Resource, ResourceCategory } from "@/types/api";

interface ResourceCardProps {
    resource: Resource;
    category?: ResourceCategory | null;
    onClick?: () => void;
}

export function ResourceCard({
    resource,
    category,
    onClick,
}: ResourceCardProps) {
    return (
        <Card
            className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
            onClick={onClick}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <HiCircleStack className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-base">
                                {resource.name || "Unnamed Resource"}
                            </CardTitle>
                            {category && (
                                <CardDescription className="text-xs">
                                    {category.name}
                                </CardDescription>
                            )}
                        </div>
                    </div>
                    {category && (
                        <Badge variant="outline" className="text-xs">
                            {category.name}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>ID: {resource.id}</span>
                    {resource.type_id && (
                        <span className="flex items-center gap-1">
                            <HiArrowTopRightOnSquare className="h-3 w-3" />
                            Type ID: {resource.type_id}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
