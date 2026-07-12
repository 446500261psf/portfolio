#!/usr/bin/env python3
"""Generate Erläuterung zum Nachtrag PDF for ELSTER upload."""

from fpdf import FPDF
from pathlib import Path


class ErlaeuterungPDF(FPDF):
    def footer(self):
        self.set_y(-15)
        self.set_font("DejaVu", "", 8)
        self.set_text_color(100, 100, 100)
        self.cell(0, 10, f"Seite {self.page_no()}", align="C")


def build_pdf(output_path: Path) -> None:
    pdf = ErlaeuterungPDF()
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.add_page()
    pdf.set_margins(25, 25, 25)

    font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    font_bold_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
    pdf.add_font("DejaVu", "", font_path)
    pdf.add_font("DejaVu", "B", font_bold_path)

    pdf.set_font("DejaVu", "B", 14)
    pdf.cell(0, 10, "Erläuterung zum Nachtrag des Einspruchs", ln=True)
    pdf.ln(4)

    pdf.set_font("DejaVu", "", 11)
    lines = [
        "Sehr geehrte Damen und Herren,",
        "",
        "bezugnehmend auf Ihr Schreiben sowie meinen bereits eingelegten Einspruch "
        "reiche ich hiermit ergänzend folgende Unterlagen und Erläuterungen ein.",
        "",
        "1. Allgemeine Hinweise zu den beigefügten Nachweisen",
        "",
        "Die von mir vorgelegten Belege stellen den Umfang der Nachweise dar, den ich "
        "nach bestem Wissen und Gewissen und im Rahmen meiner aktuellen Möglichkeiten "
        "zusammenstellen konnte.",
        "",
        "Vor meinem Studienabschluss hatte ich keine Gewohnheit, Rechnungen und Belege "
        "systematisch aufzubewahren. Zudem wurden viele Ausgaben vor der Corona-Pandemie "
        "überwiegend in bar beglichen, weshalb für zahlreiche Posten keine "
        "Zahlungsbelege mehr vorhanden sind.",
        "",
        "Die mir heute noch vorliegenden Rechnungen habe ich vor allem deshalb "
        "aufbewahrt, weil ich im Zusammenhang mit meiner Abschlussarbeit erfahren habe, "
        "dass entsprechende Aufwendungen steuerlich geltend gemacht werden können.",
        "",
        "2. Semesterbeiträge (Studienzeit 2019 bis 2024, insgesamt 12 Semester)",
        "",
        "Für den Zeitraum von 2019 bis 2024 war ich insgesamt zwölf Semester "
        "immatrikuliert. Leider kann ich mich nicht mehr in mein studentisches "
        "Online-Konto einloggen und habe daher keine vollständigen Zahlungsnachweise "
        "für die einzelnen Semesterbeiträge mehr auffinden können.",
        "",
        "Als Nachweis habe ich daher eine E-Mail meiner Hochschule beigefügt, aus der "
        "die konkreten Beträge der Semesterbeiträge hervorgehen.",
        "",
        "Mir ist bekannt, dass die Semesterbeiträge in den höheren Semestern "
        "voraussichtlich gestiegen sind. Für eine vereinfachte Berechnung haben Sie "
        "meines Erachtens jedoch auch den niedrigsten im Jahr 2019 geltenden Betrag "
        "von 296 Euro pro Semester für alle zwölf Semester zugrunde legen können.",
        "",
        "3. Materialkosten, Bücher und projektbezogene Ausgaben je Semester",
        "",
        "Einzelne Belege für projektbezogene Materialkosten, Bücher, Ausdrucke, "
        "3D-Druck sowie Metall- und Holzmaterialien aus den einzelnen Semestern "
        "können von mir nicht mehr vorgelegt werden, da diese Ausgaben seinerzeit "
        "überwiegend bar geleistet wurden und ich damals nicht beabsichtigt hatte, "
        "entsprechende Rechnungen aufzubewahren.",
        "",
        "Als einzigen noch vorhandenen Nachweis für Materialkosten kann ich eine "
        "Online-Rechnung aus dem Jahr 2019 für den Erwerb von LED-Material beifügen.",
        "",
        "Für die weiteren genannten Aufwendungen – insbesondere Hochschuldrucke, "
        "3D-Druck sowie Metall- und Holzmaterialien – liegen mir leider keine weiteren "
        "Belege mehr vor. Hierfür bitte ich um Verständnis.",
        "",
        "4. Schlussbemerkung",
        "",
        "Ich bitte Sie, die beigefügten Unterlagen bei der Prüfung meines Einspruchs "
        "zu berücksichtigen. Für die nicht mehr nachweisbaren Ausgaben bitte ich um "
        "nachsichtige Beurteilung unter Berücksichtigung der vorstehenden Erläuterungen.",
        "",
        "Für Rückfragen stehe ich Ihnen gerne zur Verfügung.",
        "",
        "Mit freundlichen Grüßen",
        "",
        "Sifan Pan",
    ]

    for line in lines:
        if line == "":
            pdf.ln(3)
        elif line.startswith(("1.", "2.", "3.", "4.")):
            pdf.set_font("DejaVu", "B", 11)
            pdf.multi_cell(0, 6, line)
            pdf.set_font("DejaVu", "", 11)
        else:
            pdf.multi_cell(0, 6, line)

    pdf.output(str(output_path))


if __name__ == "__main__":
    out = Path(__file__).parent / "Erlaeuterung_Nachtrag_Einspruch.pdf"
    build_pdf(out)
    print(f"Created: {out}")
