import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Globe,
    PlusCircle,
    List,
    BarChart,
    Users,
    History,
    Cpu,
    MessageSquare,
} from "lucide-react";

export default function AdminHome() {
    const { user } = useAuth();
    const { t, i18n } = useTranslation();

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return (
        <main className="container max-w-6xl py-10">
            <div className="flex my-10 items-center justify-between mb-8">
                <div className={"flex flex-col  items-center justify-center"}>
                    <h1 className="text-3xl font-bold text-blue-700">{t("admin_panel")}</h1>
                    <p className="text-muted-foreground mt-1">
                        {t("welcome_user", { email: user?.email })}
                    </p>
                </div>

                {/* 🌐 Language Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <Globe size={18} />
                            {i18n.language.toUpperCase()}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleLanguageChange("uz")}>🇺🇿 Uzbek</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleLanguageChange("ru")}>🇷🇺 Русский</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleLanguageChange("en")}>🇬🇧 English</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* 🧩 Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Create Traffic Light (admin only) */}
                {user?.role === "admin" && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-600">
                                <PlusCircle size={20} />
                                {t("create_title")}
                            </CardTitle>
                            <CardDescription>{t("create_desc")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link to="/create-light">
                                <Button className="w-full">{t("create_button")}</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {/* Lights List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-700">
                            <List size={20} />
                            {t("list_title")}
                        </CardTitle>
                        <CardDescription>{t("list_desc")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link to="/lights">
                            <Button variant="outline" className="w-full">
                                {t("list_button")}
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Statistics */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-600">
                            <BarChart size={20} />
                            {t("stats_title")}
                        </CardTitle>
                        <CardDescription>{t("stats_desc")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button disabled variant="secondary" className="w-full">
                            {t("stats_button")}
                        </Button>
                    </CardContent>
                </Card>

                {/* Users */}
                
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-purple-600">
                                <Users size={20} />
                                👤 {t("users_title", "Foydalanuvchilar")}
                            </CardTitle>
                            <CardDescription>
                                {t("users_desc", "Barcha foydalanuvchilar ro‘yxatini boshqarish.")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <Link to={"https://t.me/+IqgB418GODliMjZi"}>
                               <Button  className="w-full">🔒 {t("coming_soon", "Tez orada")}</Button>
                           </Link>
                        </CardContent>
                    </Card>

                {/* Logs */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-600">
                            <History size={20} />
                            📅 {t("logs_title", "Loglar")}
                        </CardTitle>
                        <CardDescription>
                            {t("logs_desc", "Foydalanuvchilar bajargan amallar tarixi.")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button disabled className="w-full">🕓 {t("coming_soon")}</Button>
                    </CardContent>
                </Card>

                {/* AI Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-indigo-600">
                            <Cpu size={20} />
                            🧠 {t("ai_title", "AI Model")}
                        </CardTitle>
                        <CardDescription>
                            {t("ai_desc", "Sun’iy intellekt holati va natijalari.")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button disabled className="w-full">🤖 {t("coming_soon")}</Button>
                    </CardContent>
                </Card>

                {/* Feedback */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-pink-600">
                            <MessageSquare size={20} />
                            📮 {t("feedback_title", "Fikrlar")}
                        </CardTitle>
                        <CardDescription>
                            {t("feedback_desc", "Foydalanuvchilarning fikr-mulohazalari.")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button disabled variant="ghost" className="w-full">
                            ✉️ {t("coming_soon")}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
