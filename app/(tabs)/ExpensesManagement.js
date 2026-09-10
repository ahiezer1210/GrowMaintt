import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
export default function ExpenseManagement() {
    const weeklyExpenses = [
        {
            name: "Food",
            amount: "$20",
            icon: "fast-food-outline",
        },
        {
            name: "transport",
            amount: "$10",
            icon: "bus-outline"
        },
        {
            name: "Basic services",
            amount: "$20",
            icon: "business-outline"
        }
    ]
    const unnecesaryExpenses = [
        {
            name: "Coffee and drinks",
            amount: "$5",
            icon: "cafe-outline"
        },
    ]
    const scheduledExpenses = [
        {
            name: "Light",
            date: "10 July",
            amount: "$18",
            icon: "bulb-outline"
        },
        {
            name: "Water",
            date: "15 July",
            amount: "$12",
            icon: "water-outline"
        }
    ]

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons
                        name="arrow-back"
                        size={25}
                        color={"#FFFFFF"}
                    />
                </TouchableOpacity>
                <Text style={styles.headertitle}>
                    Expense{"\n"}Management
                </Text>
                <TouchableOpacity style={styles.notification} onPress={() => router.push("/notifications")}>
                    <Ionicons
                        name="notifications-outline"
                        size={23}
                        color={"#0E2738"}
                    />
                </TouchableOpacity>
            </View>
            <ScrollView
                style={styles.content}
                contentContainerStyle={{
                    paddingTop: 12,
                    paddingBottom: 20,
                }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <View style={styles.sectionTitleContainer}>
                        <Ionicons
                            name="card-outline"
                            size={30}
                            color={"#0E2738"}
                        />
                        <Text style={styles.sectiontitle}>
                            Weekly expenses
                        </Text>
                    </View>
                    <View style={styles.line} />
                    {weeklyExpenses.map((expense, index) => (
                        <ExpenseItem
                            key={index}
                            name={expense.name}
                            amount={expense.amount}
                            icon={expense.icon}
                        />
                    ))}
                </View>
                <View style={styles.section}>
                    <View style={styles.sectionTitleContainer}>
                        <Ionicons
                            name="coins-outline"
                            size={30}
                            color={"#0E2738"}
                        />
                        <Text style={styles.sectiontitle}>
                            Unnecesary expenses
                        </Text>
                    </View>
                    <View style={styles.line} />
                    {unnecesaryExpenses.map((expense, index) => (
                        <ExpenseItem
                            key={index}
                            name={expense.name}
                            amount={expense.amount}
                            icon={expense.icon}
                        />
                    ))}
                </View>
                <View style={styles.section}>
                    <View style={styles.sectionTitleContainer}>
                        <Ionicons
                            name="calendar-outline"
                            size={30}
                            color={"#0E2738"}
                        />
                        <Text style={styles.sectiontitle}>
                            Scheduled expenses
                        </Text>
                    </View>
                    <View style={styles.line} />
                    {scheduledExpenses.map((expense, index) => (
                        <ScheduledExpense
                            key={index}
                            name={expense.name}
                            date={expense.date}
                            amount={expense.amount}
                            icon={expense.icon}
                        />
                    ))}
                </View>
                <View style={styles.bottomSpace} />
            </ScrollView >

            <View style={styles.bottomBar}>
                <TouchableOpacity onPress={() => router.push("/home")}>
                    <Ionicons
                        name="home-outline"
                        size={27}
                        color={"#FFFFFF"}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/historial")}>
                    <Ionicons
                        name="bar-chart-outline"
                        size={27}
                        color={"#FFFFFF"}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/ExpensesManagement")}>
                    <Ionicons
                        name="swap-horizontal-outline"
                        size={27}
                        color={"#FFFFFF"}
                    />
                </TouchableOpacity>

                <TouchableOpacity>
                    <Ionicons
                        name="layers-outline"
                        size={27}
                        color={"#FFFFFF"}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/Profile")}>
                    <Ionicons
                        name="person-outline"
                        size={27}
                        color={"#FFFFFF"}
                    />
                </TouchableOpacity>

            </View>
        </View >
    );
}
function ExpenseItem({ name, amount, icon }) {
    return (
        <View style={styles.expenseRow}>
            <View style={styles.expenseIcon}>
                <Ionicons
                    name={icon}
                    size={28}
                    color={"#FFFFFF"}
                />
            </View>
            <Text style={styles.expensename}>
                {name}
            </Text>
            <Text style={styles.amount}>
                {amount}
            </Text>
        </View>
    )
}
function ScheduledExpense({
    name,
    date,
    amount,
    icon,
}) {
    return (
        <View style={styles.expenseRow}>
            <View style={styles.expenseIcon}>
                <Ionicons
                    name={icon}
                    size={28}
                    color={"#FFFFFF"}
                />
            </View>
            <Text style={styles.expensename}>
                {name}
            </Text>
            <Text style={styles.date}>
                {date}
            </Text>
            <Text style={styles.amount}>
                {amount}
            </Text>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#081023",
    },
    header: {
        height: 130,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        backgroundColor: "#081023",
        marginTop: 30,
    },
    backButton: {
        width: 35,
        alignItems: "flex-start",
        justifyContent: "center",
    },
    headertitle: {
        flex: 1,
        color: "#FFFFFF",
        fontSize: 25,
        fontWeight: "400",
        textAlign: "center",
        lineHeight: 22,
    },
    notification: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#D8F2E2",
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingHorizontal: 20,
        marginTop: 10,
    },
    section: {
        marginBottom: 10,
    },
    sectionTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: 35,
    },
    sectiontitle: {
        color: "#172128",
        fontSize: 24,
        fontWeight: "400",
        marginLeft: 6,
    },
    line: {
        height: 1,
        backgroundColor: "#777777",
        width: "100%",
        marginTop: 12,
        marginBottom: 5,
    },
    expenseRow: {
        minHeight: 45,
        flexDirection: "row",
        alignItems: "center",
    },
    expenseIcon: {
        width: 45,
        height: 40,
        borderRadius: 16,
        backgroundColor: "#24b6d1",
        justifyContent: "center",
        alignItems: "center",
    },
    expensename: {
        flex: 1,
        marginLeft: 9,
        color: "#26313b",
        fontSize: 15,
        fontWeight: "400",
    },
    amount: {
        color: "#0066ff",
        fontSize: 14,
        fontWeight: "700",
        minWidth: 35,
        textAlign: "right",
    },
    date: {
        color: "#0066ff",
        fontSize: 11,
        marginRight: 18,
    },
    bottomSpace: {
        height: 70,
    },

    bottomBar: {
        height: 70,
        backgroundColor: "#24b6d1",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
});
