import openpyxl
from openpyxl import Workbook

# Create a workbook and select the active worksheet
wb = Workbook()
ws = wb.active
ws.title = "Azure Questions"

# Define the headers for the columns
headers = ["Question", "Option a", "Option b", "Option c", "Option d", "Answer"]

# Add headers to the worksheet
ws.append(headers)

# List of questions with options and answers
questions = [
    (
        "In a single-phase full-bridge inverter, which switching pattern eliminates the 3rd harmonic in the output voltage?",
        "Bipolar PWM", "Unipolar PWM", "Sinusoidal PWM", "Selective Harmonic Elimination", "Selective Harmonic Elimination"
    ),
    (
        "Which method is used to suppress the reverse recovery current in a diode?",
        "Snubber Circuit", "Soft Recovery Diode", "Schottky Diode", "Bypass Capacitor", "Soft Recovery Diode"
    ),
    (
        "In a DC-DC converter, what is the main advantage of using a synchronous rectifier instead of a traditional diode?",
        "Higher efficiency", "Simpler design", "Lower cost", "Larger size", "Higher efficiency"
    ),
    (
        "Which of the following control techniques is most appropriate for reducing the torque ripple in a brushless DC motor?",
        "Hysteresis Control", "Predictive Current Control", "Space Vector Modulation", "Field-Oriented Control", "Space Vector Modulation"
    ),
    (
        "For a three-phase PWM inverter, what is the impact of increasing the switching frequency on the output voltage waveform?",
        "Increased harmonic distortion", "Decreased harmonic distortion", "Increased voltage magnitude", "Decreased voltage magnitude", "Decreased harmonic distortion"
    ),
    (
        "What kind of power factor correction technique is typically used in modern switching power supplies?",
        "Passive PFC", "Active PFC", "Static VAR Compensator", "Phase Advancer", "Active PFC"
    ),
    (
        "In a dual-active bridge (DAB) converter, what is the main purpose of phase-shift control?",
        "To regulate output voltage", "To synchronize switching devices", "To control power flow", "To reduce EMI", "To control power flow"
    ),
    (
        "What is the primary benefit of using GaN or SiC devices in power electronics applications?",
        "Lower cost", "Higher current ratings", "Higher efficiency and faster switching", "Easier to manufacture", "Higher efficiency and faster switching"
    ),
    (
        "Which topology is commonly employed for high-efficiency, low-voltage DC-DC conversion?",
        "Buck Converter", "Boost Converter", "Cuk Converter", "SEPIC Converter", "Buck Converter"
    ),
    (
        "In a current-source inverter (CSI), how is the output current waveform controlled?",
        "By varying the load impedance", "By modulating the input voltage", "By controlling the switching frequency", "By using a current regulator", "By using a current regulator"
    ),
    (
        "What switching device characteristic is most critical for minimizing losses in high-frequency applications?",
        "High breakdown voltage", "Low on-resistance", "High current capability", "Fast switching speed", "Fast switching speed"
    ),
    (
        "In a flyback converter, what is the main role of the transformer?",
        "To step up the voltage", "To provide galvanic isolation", "To filter the output", "To regulate the input current", "To provide galvanic isolation"
    ),
    (
        "How does zero-voltage switching (ZVS) reduce switching losses in power converters?",
        "By turning on the device at zero current", "By turning off the device at zero current", "By turning on the device at zero voltage", "By turning off the device at zero voltage", "By turning on the device at zero voltage"
    ),
    (
        "Which pulse width modulation (PWM) technique minimizes the total harmonic distortion (THD) in three-phase inverters?",
        "Sinusoidal PWM (SPWM)", "Space Vector PWM (SVPWM)", "Hysteresis PWM", "Random PWM", "Space Vector PWM (SVPWM)"
    ),
    (
        "In a resonant converter, how is the soft-switching achieved?",
        "By using a snubber circuit", "By operating at the resonant frequency", "By increasing the switching frequency", "By decreasing the load impedance", "By operating at the resonant frequency"
    ),
    (
        "For an isolated DC-DC converter, what is the primary advantage of using a forward converter over a flyback converter?",
        "Higher efficiency for low-power applications", "Simpler design and control", "Better performance at high power levels", "Less electromagnetic interference (EMI)", "Better performance at high power levels"
    ),
    (
        "In a matrix converter, what is the main challenge of direct AC-AC conversion?",
        "Maintaining output voltage magnitude", "Ensuring bidirectional power flow", "Managing switching losses", "Controlling input current harmonics", "Managing switching losses"
    ),
    (
        "Which of the following is a key advantage of using multi-level inverters in high-voltage applications?",
        "Reduced number of components", "Improved voltage THD", "Simpler control algorithms", "Lower cost", "Improved voltage THD"
    ),
    (
        "In a bidirectional DC-DC converter, what is the main function of the control strategy?",
        "To maximize efficiency", "To regulate power flow in both directions", "To minimize switching losses", "To ensure voltage stability", "To regulate power flow in both directions"
    ),
    (
        "Which parameter is most critical for ensuring the stability of a phase-locked loop (PLL) in a power electronics system?",
        "Loop bandwidth", "Reference frequency", "Phase margin", "Gain margin", "Phase margin"
    ),
    (
        "In an active power filter (APF), what is the primary function of the control algorithm?",
        "To minimize output voltage ripple", "To cancel out load harmonics", "To regulate input current", "To improve power factor", "To cancel out load harmonics"
    ),
    (
        "For a push-pull converter, what is one of the main challenges in designing the transformer?",
        "Ensuring low leakage inductance", "Minimizing core losses", "Achieving high turns ratio", "Maintaining high flux density", "Ensuring low leakage inductance"
    ),
    (
        "In a three-phase rectifier, what is the effect of using a six-pulse configuration on the input current harmonics?",
        "Increases the harmonics", "Decreases the harmonics", "Has no effect on the harmonics", "Generates only odd harmonics", "Decreases the harmonics"
    ),
    (
        "Which of the following modulation techniques is commonly used in a Voltage Source Converter (VSC) for HVDC transmission?",
        "Hysteresis Modulation", "Sinusoidal PWM", "Space Vector Modulation", "Delta Modulation", "Space Vector Modulation"
    ),
    (
        "In a boost converter, what happens to the duty cycle as the output voltage increases?",
        "It increases", "It decreases", "It remains constant", "It varies non-linearly", "It increases"
    ),
    (
        "Which topology is best suited for applications requiring high step-up voltage conversion?",
        "Buck Converter", "Boost Converter", "Cuk Converter", "Flyback Converter", "Boost Converter"
    ),
    (
        "How is the voltage regulation typically achieved in a phase-controlled rectifier?",
        "By adjusting the firing angle", "By varying the input voltage", "By changing the load resistance", "By using a feedback loop", "By adjusting the firing angle"
    ),
    (
        "In a three-phase cycloconverter, what is the primary method for controlling the output frequency?",
        "By changing the input frequency", "By modulating the switching frequency", "By adjusting the phase angles", "By using a feedback control system", "By adjusting the phase angles"
    ),
    (
        "What is the main advantage of using IGBTs over MOSFETs in high-power applications?",
        "Higher switching speed", "Lower conduction losses", "Higher voltage handling capability", "Smaller package size", "Higher voltage handling capability"
    ),
    (
        "In a voltage-fed resonant converter, what is the impact of operating above the resonant frequency?",
        "Increased efficiency", "Reduced efficiency", "Increased load regulation", "Reduced load regulation", "Reduced efficiency"
    ),
    (
        "Which control method is commonly used for maintaining the output voltage in a switched-mode power supply (SMPS)?",
        "Voltage Mode Control", "Current Mode Control", "Hysteresis Control", "Pulse Skipping Control", "Voltage Mode Control"
    ),
    (
        "What is the main challenge in designing a high-frequency transformer for a DC-DC converter?",
        "Minimizing core losses", "Maximizing flux density", "Ensuring thermal stability", "Reducing leakage inductance", "Reducing leakage inductance"
    ),
    (
        "In a buck-boost converter, how does the duty cycle affect the output voltage polarity?",
        "Positive duty cycle results in positive output", "Negative duty cycle results in positive output", "Duty cycle does not affect polarity", "Duty cycle determines both magnitude and polarity", "Duty cycle determines both magnitude and polarity"
    ),
    (
        "Which type of power electronics device typically exhibits the highest switching frequency capability?",
        "Thyristor", "IGBT", "MOSFET", "GTO", "MOSFET"
    ),
    (
        "What is the primary role of an EMI filter in a power electronics system?",
        "To reduce switching losses", "To minimize electromagnetic interference", "To improve thermal management", "To regulate output voltage", "To minimize electromagnetic interference"
    ),
    (
        "In a single-phase AC voltage controller, how is the output voltage controlled?",
        "By varying the input frequency", "By using phase control", "By adjusting the load impedance", "By modulating the supply voltage", "By using phase control"
    ),
    (
        "Which topology is preferred for achieving high efficiency in isolated DC-DC converters for medium power applications?",
        "Flyback Converter", "Forward Converter", "Half-Bridge Converter", "Full-Bridge Converter", "Half-Bridge Converter"
    ),
    (
        "In a three-phase inverter, what is the primary benefit of using a delta-connected load over a wye-connected load?",
        "Higher line voltage", "Lower current ratings", "Better harmonic performance", "Simpler control", "Higher line voltage"
    ),
    (
        "Which of the following is a significant advantage of using digital control over analog control in power electronics?",
        "Faster response time", "Lower cost", "Better noise immunity", "Simpler implementation", "Better noise immunity"
    ),
    (
        "In a synchronous buck converter, what is the main advantage of operating in continuous conduction mode (CCM)?",
        "Lower output voltage ripple", "Higher efficiency", "Easier control", "Reduced component count", "Higher efficiency"
    ),
    (
        "What is the primary function of a snubber circuit in power electronics?",
        "To filter output voltage", "To reduce switching losses", "To protect against overvoltage", "To stabilize input current", "To protect against overvoltage"
    ),
    (
        "How does the use of a dual-active bridge (DAB) converter benefit bidirectional power flow applications?",
        "Simplifies the control algorithm", "Increases power density", "Enhances efficiency", "Provides galvanic isolation", "Provides galvanic isolation"
    ),
    (
        "In a voltage-source inverter (VSI), what is the effect of increasing the DC link voltage?",
        "Increases output current", "Decreases output voltage", "Increases output voltage", "Decreases output current", "Increases output voltage"
    ),
    (
        "Which method is used to achieve zero-current switching (ZCS) in a resonant converter?",
        "Operating at resonant frequency", "Using a snubber circuit", "Adjusting the load impedance", "Modulating the input voltage", "Operating at resonant frequency"
    ),
    (
        "What is the primary challenge in designing a power electronics system for electric vehicles (EVs)?",
        "Managing high voltage levels", "Ensuring compact size", "Achieving high efficiency", "Handling thermal management", "Handling thermal management"
    ),
    (
        "In a high-power converter, what is the main advantage of using a modular multilevel converter (MMC) topology?",
        "Simplified control", "Higher efficiency", "Scalability and redundancy", "Reduced component count", "Scalability and redundancy"
    ),
    (
        "What is the role of a precharge resistor in a power electronics system?",
        "To limit inrush current", "To regulate output voltage", "To filter output ripple", "To stabilize input voltage", "To limit inrush current"
    ),
    (
        "How does the use of interleaved converters benefit DC-DC power conversion?",
        "Reduces output voltage ripple", "Increases output voltage", "Simplifies control", "Decreases component count", "Reduces output voltage ripple"
    ),
    (
        "In a three-phase rectifier, what is the primary effect of using a twelve-pulse configuration?",
        "Reduces input current harmonics", "Increases output voltage", "Simplifies design", "Reduces component size", "Reduces input current harmonics"
    ),
    (
        "In a soft-switching converter, what is the primary benefit of using auxiliary resonant circuits?",
        "Reduces conduction losses", "Enhances voltage regulation", "Minimizes switching losses", "Improves thermal management", "Minimizes switching losses"
    ),
    (
        "What is the main advantage of using a synchronous rectifier in a buck converter?",
        "Higher efficiency", "Simpler control", "Lower cost", "Smaller size", "Higher efficiency"
    ),
    (
        "In a power electronics system, what is the primary purpose of a heat sink?",
        "To reduce electromagnetic interference", "To filter output voltage", "To dissipate heat generated by components", "To stabilize input current", "To dissipate heat generated by components"
    ),
    (
        "Which control strategy is most effective for minimizing the harmonic content in a three-phase inverter?",
        "Hysteresis Control", "Sinusoidal PWM", "Space Vector Modulation", "Random PWM", "Space Vector Modulation"
    ),
    (
        "In a DC-AC inverter, what is the impact of using a higher switching frequency on the filter design?",
        "Larger filter size required", "Smaller filter size required", "No impact on filter size", "Increases filter complexity", "Smaller filter size required"
    ),
    (
        "For a multi-level inverter, what is the main advantage of using a cascaded H-bridge topology?",
        "Reduced harmonic distortion", "Simplified control algorithm", "Lower component count", "Higher efficiency", "Reduced harmonic distortion"
    )
]

# Add each question to the worksheet
for question in questions:
    ws.append(question)

# Save the workbook
wb.save("azure_questions.xlsx")

print("Excel file 'azure_questions.xlsx' has been created successfully.")