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
                        size={20}
                        color={"#FFFFFF"}
                    />
                </TouchableOpacity>
                <Text style={styles.headertitle}>
                    Expense{"\n"}Management
                </Text>
                <View style={styles.notification}>
                    <Ionicons
                        name="notifications-outline"
                        size={15}
                        color={"#0E2738"}
                    />
                </View>
            </View>
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <View style={styles.sectionTitleContainer}>
                        <Ionicons
                            name="card-outline"
                            size={20}
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
                            size={20}
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
                            size={20}
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
        </View >
    );
}
function ExpenseItem({ name, amount, icon }) {
    return (
        <View style={styles.expenseRow}>
            <View style={styles.expenseIcon}>
                <Ionicons
                    name={icon}
                    size={19}
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
                    size={19}
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
        backgroundColor: "#0E2738",
    },
    header: {
        height: 74,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
    },
    backButton: {
        width: 35,
        alignItems: "flex-start",
    },
    headertitle: {
        flex: 1,
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "400",
        textAlign: "left",
        lineHeight: 22,
    },
    notification: {
        width: 23,
        height: 23,
        borderRadius: 12,
        backgroundColor: "#D8F2E2",
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    section: {
        marginBottom: 13,
    },
    sectionTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: 27,
    },
    sectiontitle: {
        color: "#172128",
        fontSize: 18,
        fontWeight: "400",
        marginLeft: 6,
    },
    line: {
        height: 1,
        backgroundColor: "#777777",
        width: "100%",
        marginTop: 3,
        marginBottom: 7,
    },
    expenseRow: {
        height: 45,
        flexDirection: "row",
        alignItems: "center",
    },
    expenseIcon: {
        width: 31,
        height: 31,
        borderRadius: 11,
        backgroundColor: "#3299f5",
        justifyContent: "center",
        alignItems: "center",
    },
    expensename: {
        flex: 1,
        marginLeft: 8,
        color: "#26313b",
        fontSize: 12,
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
        height: 30,
    },
});
