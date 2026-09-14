import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import { auth, db } from "../../firebaseConfig.js";

export default function ExpenseManagement() {
    const { width, height } = useWindowDimensions();

    const isSmallScreen = width < 360;
    const isMediumScreen = width >= 360 && width < 600;
    const isTablet = width >= 600;
    const isLargeScreen = width >= 900;

    const scale = isSmallScreen
        ? 0.85
        : isMediumScreen
            ? 1
            : isTablet
                ? 1.15
                : 1.25;

    const horizontalPadding = isSmallScreen
        ? 18
        : isMediumScreen
            ? 25
            : isTablet
                ? 45
                : 60;

    const s = (value) => Math.round(value * scale);

    const [expenses, setExpenses] = useState([]);
    const [savings, setSavings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedExpense, setSelectedExpense] = useState(null);

    useEffect(() => {
        const user = auth.currentUser;

        if (!user) {
            setExpenses([]);
            setSavings([]);
            setLoading(false);
            return;
        }

        const expensesRef = collection(
            db,
            "Registro de gastos"
        );

        const savingsRef = collection(
            db,
            "Ahorros"
        );

        const expensesQuery = query(
            expensesRef,
            orderBy("createdAt", "desc")
        );

        const unsubscribeExpenses = onSnapshot(
            expensesQuery,
            (snapshot) => {
                const data = snapshot.docs
                    .map((document) => ({
                        id: document.id,
                        ...document.data(),
                    }))
                    .filter(
                        (expense) =>
                            expense.uid === user.uid
                    );

                setExpenses(data);
                setLoading(false);
            },
            (error) => {
                console.error(
                    "Error loading expenses:",
                    error
                );
                setLoading(false);
            }
        );

        const unsubscribeSavings = onSnapshot(
            savingsRef,
            (snapshot) => {
                const data = snapshot.docs
                    .map((document) => ({
                        id: document.id,
                        ...document.data(),
                    }))
                    .filter(
                        (saving) =>
                            saving.uid === user.uid
                    );

                setSavings(data);
            },
            (error) => {
                console.error(
                    "Error loading savings:",
                    error
                );
            }
        );

        return () => {
            unsubscribeExpenses();
            unsubscribeSavings();
        };
    }, []);

    const weeklyExpenses = expenses.filter(
        (expense) =>
            expense.expenseType?.toLowerCase() ===
            "weekly"
    );

    const unnecessaryExpenses = expenses.filter(
        (expense) =>
            expense.expenseType?.toLowerCase() ===
            "unnecessary"
    );

    const scheduledExpenses = expenses.filter(
        (expense) =>
            expense.expenseType?.toLowerCase() ===
                "monthly" ||
            expense.isRecurrent === true
    );

    const formatAmount = (amount) => {
        const number = Number(amount);

        if (isNaN(number)) {
            return "$0.00";
        }

        return `$${number.toFixed(2)}`;
    };

    const getIcon = (category) => {
        const value =
            category?.toLowerCase() || "";

        if (
            value.includes("food") ||
            value.includes("comida")
        ) {
            return "fast-food-outline";
        }

        if (
            value.includes("transport") ||
            value.includes("transporte") ||
            value.includes("bus")
        ) {
            return "bus-outline";
        }

        if (
            value.includes("light") ||
            value.includes("electric") ||
            value.includes("electricity") ||
            value.includes("luz")
        ) {
            return "bulb-outline";
        }

        if (
            value.includes("water") ||
            value.includes("agua")
        ) {
            return "water-outline";
        }

        if (
            value.includes("coffee") ||
            value.includes("drink") ||
            value.includes("cafe")
        ) {
            return "cafe-outline";
        }

        if (
            value.includes("service") ||
            value.includes("servicio")
        ) {
            return "business-outline";
        }

        return "wallet-outline";
    };

    const formatDate = (date) => {
        if (!date) {
            return "";
        }

        if (typeof date === "string") {
            return date;
        }

        if (date?.toDate) {
            const dateObject = date.toDate();

            return dateObject.toLocaleDateString(
                "en-US",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                }
            );
        }

        return "";
    };

    const toggleExpense = (
        expense,
        section
    ) => {
        const selectedId = `${section}-${expense.id}`;

        setSelectedExpense((currentId) =>
            currentId === selectedId
                ? null
                : selectedId
        );
    };

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.header,
                    {
                        height: s(130),
                        paddingHorizontal:
                            horizontalPadding,
                        marginTop: s(30),
                    },
                ]}
            >
                <TouchableOpacity
                    style={[
                        styles.backButton,
                        {
                            width: s(35),
                            height: s(35),
                        },
                    ]}
                    onPress={() =>
                        router.back()
                    }
                >
                    <Ionicons
                        name="arrow-back"
                        size={s(25)}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <Text
                    style={[
                        styles.headertitle,
                        {
                            fontSize: s(25),
                            lineHeight: s(27),
                        },
                    ]}
                >
                    Expense{"\n"}Management
                </Text>

                <TouchableOpacity
                    style={[
                        styles.notification,
                        {
                            width: s(30),
                            height: s(30),
                            borderRadius: s(15),
                        },
                    ]}
                    onPress={() =>
                        router.push(
                            "/notifications"
                        )
                    }
                >
                    <Ionicons
                        name="notifications-outline"
                        size={s(23)}
                        color="#0E2738"
                    />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={[
                    styles.content,
                    {
                        paddingHorizontal:
                            horizontalPadding,
                        marginTop: s(10),
                        borderTopLeftRadius:
                            s(35),
                        borderTopRightRadius:
                            s(35),
                    },
                ]}
                contentContainerStyle={{
                    paddingTop: s(12),
                    paddingBottom: s(20),
                }}
                showsVerticalScrollIndicator={
                    false
                }
            >
                {loading ? (
                    <View
                        style={[
                            styles.loadingContainer,
                            {
                                paddingTop: s(50),
                            },
                        ]}
                    >
                        <ActivityIndicator
                            size={
                                isTablet
                                    ? "large"
                                    : "small"
                            }
                            color="#24b6d1"
                        />

                        <Text
                            style={[
                                styles.loadingText,
                                {
                                    fontSize: s(15),
                                    marginTop: s(12),
                                },
                            ]}
                        >
                            Loading expenses...
                        </Text>
                    </View>
                ) : (
                    <>
                        <View
                            style={[
                                styles.section,
                                {
                                    marginBottom:
                                        s(10),
                                },
                            ]}
                        >
                            <View
                                style={[
                                    styles.sectionTitleContainer,
                                    {
                                        minHeight:
                                            s(35),
                                    },
                                ]}
                            >
                                <Ionicons
                                    name="card-outline"
                                    size={s(30)}
                                    color="#0E2738"
                                />

                                <Text
                                    style={[
                                        styles.sectiontitle,
                                        {
                                            fontSize:
                                                s(24),
                                            marginLeft:
                                                s(6),
                                        },
                                    ]}
                                    numberOfLines={
                                        2
                                    }
                                >
                                    Weekly expenses
                                </Text>
                            </View>

                            <View
                                style={[
                                    styles.line,
                                    {
                                        marginTop:
                                            s(12),
                                        marginBottom:
                                            s(5),
                                    },
                                ]}
                            />

                            {weeklyExpenses.length >
                            0 ? (
                                weeklyExpenses.map(
                                    (expense) => (
                                        <ExpenseItem
                                            key={`weekly-${expense.id}`}
                                            expense={
                                                expense
                                            }
                                            selected={
                                                selectedExpense ===
                                                `weekly-${expense.id}`
                                            }
                                            onPress={() =>
                                                toggleExpense(
                                                    expense,
                                                    "weekly"
                                                )
                                            }
                                            formatAmount={
                                                formatAmount
                                            }
                                            formatDate={
                                                formatDate
                                            }
                                            getIcon={
                                                getIcon
                                            }
                                            scale={
                                                scale
                                            }
                                        />
                                    )
                                )
                            ) : (
                                <EmptyMessage
                                    text="No weekly expenses"
                                    scale={
                                        scale
                                    }
                                />
                            )}
                        </View>

                        <View
                            style={[
                                styles.section,
                                {
                                    marginBottom:
                                        s(10),
                                },
                            ]}
                        >
                            <View
                                style={[
                                    styles.sectionTitleContainer,
                                    {
                                        minHeight:
                                            s(35),
                                    },
                                ]}
                            >
                                <Ionicons
                                    name="coins-outline"
                                    size={s(30)}
                                    color="#0E2738"
                                />

                                <Text
                                    style={[
                                        styles.sectiontitle,
                                        {
                                            fontSize:
                                                s(24),
                                            marginLeft:
                                                s(6),
                                        },
                                    ]}
                                    numberOfLines={
                                        2
                                    }
                                >
                                    Unnecessary expenses
                                </Text>
                            </View>

                            <View
                                style={[
                                    styles.line,
                                    {
                                        marginTop:
                                            s(12),
                                        marginBottom:
                                            s(5),
                                    },
                                ]}
                            />

                            {unnecessaryExpenses.length >
                            0 ? (
                                unnecessaryExpenses.map(
                                    (expense) => (
                                        <ExpenseItem
                                            key={`unnecessary-${expense.id}`}
                                            expense={
                                                expense
                                            }
                                            selected={
                                                selectedExpense ===
                                                `unnecessary-${expense.id}`
                                            }
                                            onPress={() =>
                                                toggleExpense(
                                                    expense,
                                                    "unnecessary"
                                                )
                                            }
                                            formatAmount={
                                                formatAmount
                                            }
                                            formatDate={
                                                formatDate
                                            }
                                            getIcon={
                                                getIcon
                                            }
                                            scale={
                                                scale
                                            }
                                        />
                                    )
                                )
                            ) : (
                                <EmptyMessage
                                    text="No unnecessary expenses"
                                    scale={
                                        scale
                                    }
                                />
                            )}
                        </View>

                        <View
                            style={[
                                styles.section,
                                {
                                    marginBottom:
                                        s(10),
                                },
                            ]}
                        >
                            <View
                                style={[
                                    styles.sectionTitleContainer,
                                    {
                                        minHeight:
                                            s(35),
                                    },
                                ]}
                            >
                                <Ionicons
                                    name="calendar-outline"
                                    size={s(30)}
                                    color="#0E2738"
                                />

                                <Text
                                    style={[
                                        styles.sectiontitle,
                                        {
                                            fontSize:
                                                s(24),
                                            marginLeft:
                                                s(6),
                                        },
                                    ]}
                                    numberOfLines={
                                        2
                                    }
                                >
                                    Scheduled expenses
                                </Text>
                            </View>

                            <View
                                style={[
                                    styles.line,
                                    {
                                        marginTop:
                                            s(12),
                                        marginBottom:
                                            s(5),
                                    },
                                ]}
                            />

                            {scheduledExpenses.length >
                            0 ? (
                                scheduledExpenses.map(
                                    (expense) => (
                                        <ScheduledExpense
                                            key={`scheduled-${expense.id}`}
                                            expense={
                                                expense
                                            }
                                            selected={
                                                selectedExpense ===
                                                `scheduled-${expense.id}`
                                            }
                                            onPress={() =>
                                                toggleExpense(
                                                    expense,
                                                    "scheduled"
                                                )
                                            }
                                            formatAmount={
                                                formatAmount
                                            }
                                            formatDate={
                                                formatDate
                                            }
                                            getIcon={
                                                getIcon
                                            }
                                            scale={
                                                scale
                                            }
                                        />
                                    )
                                )
                            ) : (
                                <EmptyMessage
                                    text="No scheduled expenses"
                                    scale={
                                        scale
                                    }
                                />
                            )}
                        </View>

                        <View
                            style={{
                                height: s(
                                    70
                                ),
                            }}
                        />
                    </>
                )}
            </ScrollView>

            <View
                style={[
                    styles.bottomBar,
                    {
                        height: s(70),
                        paddingHorizontal:
                            horizontalPadding,
                    },
                ]}
            >
                <TouchableOpacity
                    onPress={() =>
                        router.push("/home")
                    }
                    style={styles.navButton}
                >
                    <Ionicons
                        name="home-outline"
                        size={s(27)}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        router.push(
                            "/historial"
                        )
                    }
                    style={styles.navButton}
                >
                    <Ionicons
                        name="bar-chart-outline"
                        size={s(27)}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        router.push(
                            "/expensesManagement"
                        )
                    }
                    style={styles.navButton}
                >
                    <Ionicons
                        name="swap-horizontal-outline"
                        size={s(27)}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        router.push(
                            "/currentgoal"
                        )
                    }
                    style={styles.navButton}
                >
                    <Ionicons
                        name="layers-outline"
                        size={s(27)}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        router.push("/profile")
                    }
                    style={styles.navButton}
                >
                    <Ionicons
                        name="person-outline"
                        size={s(27)}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

function ExpenseItem({
    expense,
    selected,
    onPress,
    formatAmount,
    formatDate,
    getIcon,
    scale,
}) {
    const s = (value) =>
        Math.round(value * scale);

    return (
        <View>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={onPress}
                style={[
                    styles.expenseRow,
                    {
                        minHeight: s(45),
                        paddingVertical: s(4),
                    },
                ]}
            >
                <View
                    style={[
                        styles.expenseIcon,
                        {
                            width: s(45),
                            height: s(40),
                            borderRadius: s(16),
                        },
                    ]}
                >
                    <Ionicons
                        name={getIcon(
                            expense.category
                        )}
                        size={s(28)}
                        color="#FFFFFF"
                    />
                </View>

                <Text
                    style={[
                        styles.expensename,
                        {
                            marginLeft: s(9),
                            fontSize: s(15),
                        },
                    ]}
                    numberOfLines={1}
                >
                    {expense.category}
                </Text>

                <Text
                    style={[
                        styles.amount,
                        {
                            fontSize: s(14),
                            minWidth: s(35),
                            marginLeft: s(5),
                        },
                    ]}
                >
                    {formatAmount(
                        expense.amount
                    )}
                </Text>
            </TouchableOpacity>

            {selected && (
                <ExpenseDetails
                    expense={expense}
                    formatAmount={
                        formatAmount
                    }
                    formatDate={formatDate}
                    scale={scale}
                />
            )}
        </View>
    );
}

function ScheduledExpense({
    expense,
    selected,
    onPress,
    formatAmount,
    formatDate,
    getIcon,
    scale,
}) {
    const s = (value) =>
        Math.round(value * scale);

    return (
        <View>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={onPress}
                style={[
                    styles.expenseRow,
                    {
                        minHeight: s(45),
                        paddingVertical: s(4),
                    },
                ]}
            >
                <View
                    style={[
                        styles.expenseIcon,
                        {
                            width: s(45),
                            height: s(40),
                            borderRadius: s(16),
                        },
                    ]}
                >
                    <Ionicons
                        name={getIcon(
                            expense.category
                        )}
                        size={s(28)}
                        color="#FFFFFF"
                    />
                </View>

                <Text
                    style={[
                        styles.expensename,
                        {
                            marginLeft: s(9),
                            fontSize: s(15),
                        },
                    ]}
                    numberOfLines={1}
                >
                    {expense.category}
                </Text>

                <Text
                    style={[
                        styles.date,
                        {
                            fontSize: s(11),
                            marginRight: s(18),
                        },
                    ]}
                    numberOfLines={1}
                >
                    {formatDate(
                        expense.date
                    )}
                </Text>

                <Text
                    style={[
                        styles.amount,
                        {
                            fontSize: s(14),
                            minWidth: s(35),
                        },
                    ]}
                >
                    {formatAmount(
                        expense.amount
                    )}
                </Text>
            </TouchableOpacity>

            {selected && (
                <ExpenseDetails
                    expense={expense}
                    formatAmount={
                        formatAmount
                    }
                    formatDate={formatDate}
                    scale={scale}
                />
            )}
        </View>
    );
}

function ExpenseDetails({
    expense,
    formatAmount,
    formatDate,
    scale,
}) {
    const s = (value) =>
        Math.round(value * scale);

    return (
        <View
            style={[
                styles.detailsContainer,
                {
                    marginLeft: s(54),
                    marginTop: s(5),
                    marginBottom: s(12),
                    padding: s(12),
                    borderRadius: s(12),
                },
            ]}
        >
            <DetailRow
                label="Amount"
                value={formatAmount(
                    expense.amount
                )}
                scale={scale}
            />

            <DetailRow
                label="Category"
                value={
                    expense.category ||
                    "N/A"
                }
                scale={scale}
            />

            <DetailRow
                label="Date"
                value={
                    formatDate(
                        expense.date
                    ) || "N/A"
                }
                scale={scale}
            />

            <DetailRow
                label="Description"
                value={
                    expense.description ||
                    "N/A"
                }
                scale={scale}
            />

            <DetailRow
                label="Rounded amount"
                value={formatAmount(
                    expense.roundingAmount
                )}
                scale={scale}
            />

            <DetailRow
                label="Expense type"
                value={
                    expense.expenseType ||
                    "N/A"
                }
                scale={scale}
            />

            <DetailRow
                label="Recurring"
                value={
                    expense.isRecurrent
                        ? "Yes"
                        : "No"
                }
                scale={scale}
            />
        </View>
    );
}

function DetailRow({
    label,
    value,
    scale,
}) {
    const s = (number) =>
        Math.round(number * scale);

    return (
        <View
            style={[
                styles.detailRow,
                {
                    marginBottom: s(6),
                },
            ]}
        >
            <Text
                style={[
                    styles.detailLabel,
                    {
                        fontSize: s(12),
                    },
                ]}
            >
                {label}
            </Text>

            <Text
                style={[
                    styles.detailValue,
                    {
                        fontSize: s(12),
                    },
                ]}
            >
                {value}
            </Text>
        </View>
    );
}

function EmptyMessage({
    text,
    scale,
}) {
    return (
        <Text
            style={[
                styles.emptyText,
                {
                    fontSize: Math.round(
                        13 * scale
                    ),
                    marginVertical:
                        Math.round(
                            10 * scale
                        ),
                },
            ]}
        >
            {text}
        </Text>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#081023",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#081023",
    },

    backButton: {
        alignItems: "flex-start",
        justifyContent: "center",
    },

    headertitle: {
        flex: 1,
        color: "#FFFFFF",
        fontWeight: "400",
        textAlign: "center",
    },

    notification: {
        backgroundColor: "#D8F2E2",
        alignItems: "center",
        justifyContent: "center",
    },

    content: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    section: {
        width: "100%",
    },

    sectionTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    sectiontitle: {
        color: "#172128",
        fontWeight: "400",
        flex: 1,
        flexShrink: 1,
    },

    line: {
        height: 1,
        backgroundColor: "#777777",
        width: "100%",
    },

    expenseRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    expenseIcon: {
        backgroundColor: "#24b6d1",
        justifyContent: "center",
        alignItems: "center",
    },

    expensename: {
        flex: 1,
        color: "#26313b",
        fontWeight: "400",
    },

    amount: {
        color: "#0066ff",
        fontWeight: "700",
        textAlign: "right",
    },

    date: {
        color: "#0066ff",
        flexShrink: 1,
    },

    emptyText: {
        color: "#888888",
        fontWeight: "400",
    },

    loadingContainer: {
        alignItems: "center",
    },

    loadingText: {
        color: "#777777",
    },

    detailsContainer: {
        backgroundColor: "#F2F8FA",
    },

    detailRow: {
        flexDirection: "row",
        alignItems: "flex-start",
    },

    detailLabel: {
        width: "40%",
        color: "#777777",
        fontWeight: "600",
    },

    detailValue: {
        flex: 1,
        color: "#26313b",
        fontWeight: "400",
        textAlign: "right",
    },

    bottomBar: {
        backgroundColor: "#24b6d1",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },

    navButton: {
        alignItems: "center",
        justifyContent: "center",
    },
});