import reflex as rx
from rxconfig import config

import requests

HOME="/"
ABOUT="/about"
REGISTER="/register"
POSTS="/posts"
LOG_IN="/log_in"
API_URL = "http://127.0.0.1:8000"

class State(rx.State):
    label = " Im carlos!!"

    def handle_input_change(self, val):
        self.label = val
    def did_click(self): 
        print("  did_click")

    message = ""
    def register_user(self, name, email, password):
        response = requests.post(f"{API_URL}/register", json={"name": name, "email": email, "password": password})
        if response.status_code == 200:
            self.message = "Registration successful!"
        else:
            self.message = response.json().get("detail", "Registration failed.")

    def log_in_user(self, email, password):
        response = requests.post(f"{API_URL}/login", json={"email": email, "password": password})
        if response.status_code == 200:
            self.message = "Login successful!"
            self.logged_in_user = response.json().get("user_id")
        else:
            self.message = "Invalid credentials"


class navState(rx.State):
    def to_home(self):
        return rx.redirect(HOME)

    def to_about(self):
        return rx.redirect(ABOUT)
    
    def to_register(self):
        return rx.redirect(REGISTER)

    def to_posts(self):
        return rx.redirect(POSTS)

    def to_log_in(self):
        return rx.redirect(LOG_IN)


def navbar_link(text: str, url: str) -> rx.Component:
    return rx.link(
        rx.text(text, size="4", weight="medium"), href=url
    )

def navbar() -> rx.Component:
    return rx.box(
        rx.desktop_only(
            rx.hstack(
                rx.hstack(
                    rx.image(
                        src="/armadura.jpg",
                        width="4.5em",
                        height="3.5em",
                        border_radius="25%",
                    ),
                    rx.heading(
                        "Zorch", size="9", weight="bold"
                    ),
                    align_items="center",
                ),
                rx.hstack(
                    navbar_link("Home", HOME),
                    navbar_link("About", ABOUT),
                    navbar_link("Posts", POSTS),
                    spacing="5",
                ),
                rx.hstack(
                    rx.button(
                        "Register",
                        size="4",
                        variant="outline",
                        on_click=navState.to_register,
                    ),
                    rx.button("Log In", size="4",
                    spacing="4",
                    justify="end",
                    on_click=navState.to_log_in,
                    ),
                ),
                justify="between",
                align_items="center",
            ),
        ),
        rx.mobile_and_tablet(
            rx.hstack(
                rx.hstack(
                    rx.image(
                        src="/armadura.jpg",
                        width="2em",
                        height="auto",
                        border_radius="25%",
                    ),
                    rx.heading(
                        "Reflex", size="6", weight="bold"
                    ),
                    align_items="center",
                ),
                rx.menu.root(
                    rx.menu.trigger(
                        rx.icon("menu", size=30)
                    ),
                    rx.menu.content(
                        rx.menu.item("Home", on_click=navState.to_home),
                        rx.menu.item("About", on_click=navState.to_about),
                        rx.menu.item("Posts", on_click=navState.to_posts),
                        rx.menu.separator(),
                        rx.menu.item("Log in", on_click=navState.to_log_in),
                        rx.menu.item("Register", on_click=navState.to_register),
                    ),
                    justify="end",
                ),
                justify="between",
                align_items="center",
            ),
        ),
        bg=rx.color("accent", 3),
        padding="1em",
        width="100%",
    )

def base_page(child: rx.Component, *args, **kwargs) -> rx.Component:
    return rx.fragment(navbar(),
                       rx.box(child,
                          bg=rx.color("accent", 3),
                          padding="1em",
                          width="100%",
                          ),
                       rx.color_mode.button(position="bottom-left"),
                       )

def about_page() -> rx.Component:
    about = rx.vstack(
                rx.heading("About....", size="9"),
                rx.text(
                    " Universidad Andes ",
                ),
                spacing="5",
                justify="center",
                align="center",
                text_align="center",
                min_height="85vh",
        )
    return base_page(about)

def register_page() -> rx.Component:
    name_input = rx.input(placeholder="Name")
    email_input = rx.input(placeholder="Email", type="email")
    password_input = rx.input(placeholder="Password", type="password")

    return base_page(
        rx.vstack(
            rx.heading("User Registration", size="9"),
            name_input,
            email_input,
            password_input,
            rx.button("Register", on_click=lambda: State.register_user(name_input.value, email_input.value, password_input.value)),
            rx.text(State.message),
            spacing="5",
            justify="center",
            align="center",
            text_align="center",
            min_height="85vh",
        )
    )

def log_in_page() -> rx.Component:
    email_input = rx.input(placeholder="Email", type="email")
    password_input = rx.input(placeholder="Password", type="password")

    return base_page(
        rx.vstack(
            rx.heading("Log In", size="9"),
            email_input,
            password_input,
            rx.button("Log In", on_click=lambda: State.log_in_user(email_input.value, password_input.value)),
            rx.text(State.message),
            spacing="5",
            justify="center",
            align="center",
            text_align="center",
            min_height="85vh",
        )
    )

def posts_page() -> rx.Component:
    return base_page(
        rx.vstack(
            rx.heading("Manage Posts", size="9"),
            rx.button("Add New Post"),
            rx.button("Edit Post"),
            rx.button("Delete Post"),
            spacing="5",
            justify="center",
            align="center",
            text_align="center",
            min_height="85vh",
        )
    )

def index() -> rx.Component:
    # Welcome Page (Index)
    return base_page(
        rx.vstack(
            rx.heading("Welcome to BlogApp!", size="9"),
            rx.text(
                "Get started by editing ",
                rx.code(f"{config.app_name}/{config.app_name}.py"),
                size="5",
            ),
            rx.input(default_value=State.label,
                 on_click=State.did_click,
                 on_change=State.handle_input_change
                 ),
            rx.link(
            rx.button("Check About us!!"),
                on_click=navState.to_about,
            ),
            spacing="5",
            justify="center",
            align="center",
            text_align="center",
            min_height="85vh",
        ),
    )


app = rx.App()
app.add_page(index)
app.add_page(about_page, route=ABOUT)
app.add_page(register_page, route=REGISTER)
app.add_page(posts_page, route=POSTS)
app.add_page(log_in_page, route=LOG_IN)
