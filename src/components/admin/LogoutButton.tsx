
"use client";

export default function LogoutButton() {
    function handleLogout(event: React.FormEvent<HTMLFormElement>) {
        const confirmed = window.confirm(
            "Are you sure you want to log out?"
        );

        if (!confirmed) {
            event.preventDefault();
        }
    }

    return (
        <form action="/api/auth/logout" method="post" onSubmit={handleLogout} > <button type="submit" className=" rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm font-medium text-zinc-400 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400">
            Log out
        </button>
        </form>
    );
}