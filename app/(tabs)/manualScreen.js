import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ManualScreen({ navigation }) {
  return (
    <View style={styles.screen}>

      <StatusBar
        backgroundColor="#071426"
        barStyle="light-content"
      />

    
      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={34}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            User Manual
          </Text>

          <Text style={styles.headerSubtitle}>
            Everything you need to know
          </Text>
        </View>

        <View style={styles.bellButton}>
          <MaterialCommunityIcons
            name="bell-outline"
            size={27}
            color="#397468"
          />
        </View>

      </View>

    
      <View style={styles.main}>

        <View style={styles.content}>

          <Text style={styles.mainTitle}>
            What is GrowMait?
          </Text>

          <View style={styles.introBox}>
            <Text style={styles.introText}>
              GrowMait is your ally to keep control of your finances,
              expenses and savings. Everything in one simple, easy
              and secure place.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Home</Text>
            <Text style={styles.sectionText}>
              Know your balance, recent activity and get a quick summary of your finances.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Add Expense</Text>
            <Text style={styles.sectionText}>
              Register your daily expenses and classify them by category.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Reports</Text>
            <Text style={styles.sectionText}>
              Visualize your income, expenses and savings with charts and statistics.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Savings</Text>
            <Text style={styles.sectionText}>
              Create savings goals, contribute regularly and reach your objectives.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Transactions</Text>
            <Text style={styles.sectionText}>
              Review the history of all your financial movements in detail.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Settings</Text>
            <Text style={styles.sectionText}>
              Manage your account preferences and configuration.
            </Text>
          </View>

          <View style={styles.tipsHeader}>
            <MaterialCommunityIcons
              name="lightbulb-outline"
              size={29}
              color="#071426"
            />

            <Text style={styles.tipsTitle}>
              Useful Tips
            </Text>
          </View>

          <View style={styles.tip}>
            <MaterialCommunityIcons
              name="shield-check-outline"
              size={36}
              color="#071426"
            />

            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>
                Keep your data safe
              </Text>

              <Text style={styles.tipDescription}>
                Do not share your password or sign in on shared devices.
              </Text>
            </View>
          </View>

          <View style={styles.tip}>
            <MaterialCommunityIcons
              name="bullseye-arrow"
              size={36}
              color="#071426"
            />

            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>
                Set realistic goals
              </Text>

              <Text style={styles.tipDescription}>
                Start with small goals and increase them little by little.
              </Text>
            </View>
          </View>

        </View>


        <View style={styles.bottomBar}>

          <TouchableOpacity style={styles.navButton}>
            <MaterialCommunityIcons
              name="home-outline"
              size={32}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton}>
            <MaterialCommunityIcons
              name="chart-box-outline"
              size={32}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton}>
            <MaterialCommunityIcons
              name="swap-horizontal"
              size={34}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton}>
            <MaterialCommunityIcons
              name="layers-outline"
              size={32}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton}>
            <MaterialCommunityIcons
              name="account-outline"
              size={32}
              color="#FFFFFF"
            />
          </TouchableOpacity>

        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: '#071426',
  },

  header: {
    height: 105,
    width: '100%',
    backgroundColor: '#071426',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },

  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },

  headerSubtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 2,
  },

  bellButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#E2F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  main: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    overflow: 'hidden',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  mainTitle: {
    textAlign: 'center',
    color: '#263B3D',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 10,
  },

  introBox: {
    backgroundColor: '#2BB3CA',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 5,
  },

  introText: {
    color: '#073246',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '700',
  },

  section: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#42B7C8',
    paddingVertical: 3,
  },

  sectionTitle: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '800',
  },

  sectionText: {
    color: '#222222',
    fontSize: 12,
    lineHeight: 15,
  },

  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 3,
  },

  tipsTitle: {
    color: '#071426',
    fontSize: 21,
    fontWeight: '800',
    marginLeft: 8,
  },

  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#42B7C8',
    paddingVertical: 4,
  },

  tipContent: {
    flex: 1,
    marginLeft: 10,
  },

  tipTitle: {
    color: '#111111',
    fontSize: 15,
    fontWeight: '800',
  },

  tipDescription: {
    color: '#42AFC1',
    fontSize: 11,
    lineHeight: 14,
    marginTop: 1,
  },

  bottomBar: {
    height: 78,
    width: '100%',
    backgroundColor: '#2BB3CA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopLeftRadius: 70,
  },

  navButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

});