import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Pressable,
  Platform,
  Modal,
} from "react-native";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolateColor,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { SvgXml } from "react-native-svg";
import { MaterialIcons } from "@expo/vector-icons";

import PointCube from "./PointCube";

const emailSvg = `<svg viewBox="0 0 32 32" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M28 5H4c-1.104 0-2 .896-2 2v18c0 1.104.896 2 2 2h24c1.104 0 2-.896 2-2V7c0-1.104-.896-2-2-2zm0 4.879L16 18 4 9.879V7l12 8 12-8v2.879zM4 23V11.885l11.446 7.63c.269.18.594.274.921.274s.652-.094.92-.274L28 11.885V23H4z" fill="#DE3163"/></svg>`;
const linkedinSvg = `<svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path></svg>`;
const githubSvg = `<svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>`;

const SocialButton = ({ iconSvg, text, iconColor }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TouchableOpacity
      style={{
        height: 50,
        width: isHovered ? 140 : 50,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        backgroundColor: "white",
        margin: 5,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        flexDirection: "row",
        transitionProperty: "width",
        transitionDuration: "0.3s",
        ...(isHovered ? { width: 150, borderRadius: 5 } : null),
      }}
      onPress={() => {
        if (iconSvg === linkedinSvg) {
          Linking.openURL("https://www.linkedin.com/in/biel-martinez-olive/");
        } else if (iconSvg === emailSvg) {
          Linking.openURL(
            "https://mail.google.com/mail/?view=cm&fs=1&to=info@bielolive.dev"
          );
        } else if (iconSvg === githubSvg) {
          Linking.openURL("https://github.com/biiiliii");
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SvgXml xml={iconSvg} width="24" height="24" fill={iconColor} />
      </View>
      <View
        style={[
          {
            width: isHovered ? 80 : 0,
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
            transitionProperty: "width",
            transitionDuration: "0.5s",
          },
        ]}
      >
        <Text
          style={{
            fontSize: 14,
            color: "#333",
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SCREEN_WIDTH = Dimensions.get("window").width;
const MotionText = motion(Text);
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function App() {
  const [colorIndex, setColorIndex] = useState(0);
  const colors = ["#88D498", "#F5A623", "#4A90E2", "#BD10E0", "#FF3D00"];

  const words = ["BEAUTIFUL", "INTERACTIVE", "ENGAGING"];
  const [wordIndex, setWordIndex] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Referències per fer scroll a cada secció
  const scrollRef = useRef();
  const startRef = useRef();
  const aboutRef = useRef();
  const projectsRef = useRef();
  const contactRef = useRef();

  // Funció per fer scroll a una secció
  const scrollToSection = (ref) => {
    if (ref.current && scrollRef.current) {
      ref.current.measureLayout(
        scrollRef.current.getInnerViewNode(),
        (x, y) => {
          scrollRef.current.scrollTo({ y, animated: true });
          setMenuOpen(false);
        }
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const bgColor = interpolateColor(
      scrollY.value,
      [0, SCREEN_HEIGHT],
      ["black", "white"]
    );
    return { backgroundColor: bgColor };
  });

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const ShineCard = ({ children, style, onPress }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <Pressable
        onPress={onPress}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        style={({ hovered }) => [
          style,
          (isHovered || hovered) && Platform.OS === "web"
            ? {
                shadowColor: "#fff",
                shadowOpacity: 0.4,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 0 },
                borderColor: "#e0e0e0",
                borderWidth: 1,
                transform: [{ scale: 1.03 }],
                zIndex: 1,
              }
            : {},
        ]}
      >
        {children}
        {isHovered && Platform.OS === "web" && (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 16,
              backgroundColor: "rgba(255,255,255,0.18)",
              opacity: 0.7,
            }}
          />
        )}
      </Pressable>
    );
  };

  const projects = [
    {
      title: "Music Match",
      description:
        "Use the Spotify API to create playlists with your friends by swiping right on your favorite songs. A fun way to discover new music together!",
      frontend: "React Native",
      backend: "Firebase",
      images: [],
      color_theme: "#1DB954",
    },
    {
      title: "Beer Real",
      description:
        "Connect with your friend and see graphs of your and your friend's beer consumption. A fun way to track your drinking habits!",
      frontend: "React Native",
      backend: "Firebase, Flask",
      color_theme: "#FBBE0A",
    },
    {
      title: "Portfolio",
      description: "My personal portfolio showcasing my projects and skills.",
      frontend: "React Native",
      color_theme: "white",
    },
  ];

  // Afegeix aquest hook per saber en quina secció estàs
  const [menuColor, setMenuColor] = useState("black");

  useEffect(() => {
    // Calcula la secció segons la posició de l'scroll
    const listener = scrollY;
    const updateMenuColor = () => {
      // Si estàs a la primera pantalla (fons negre)
      if (scrollY.value < SCREEN_HEIGHT * 0.8) {
        setMenuColor("white");
      } else {
        setMenuColor("black");
      }
    };

    // Actualitza el color cada cop que scrollY canvia
    const id = setInterval(updateMenuColor, 100);
    return () => clearInterval(id);
  }, [scrollY]);

  return (
    <>
      {/* MENU FIX A DALT A LA DRETA */}
      <View
        style={{
          position: "absolute",
          top: 30,
          right: 40,
          zIndex: 1000,
        }}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          onPress={() => setMenuOpen((v) => !v)}
          style={{
            backgroundColor: "transparent",
            borderRadius: 24,
            padding: 12,
          }}
          activeOpacity={0.7}
        >
          {/* Icona de menú custom */}
          <View style={{ width: 32, height: 32, justifyContent: "center" }}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={{
                  height: 3,
                  backgroundColor: menuColor,
                  marginVertical: 3,
                  borderRadius: 2,
                  width: 32,
                }}
              />
            ))}
          </View>
        </TouchableOpacity>
        {menuOpen && (
          <View
            style={{
              marginTop: 10,
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 16,
              minWidth: 180,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
            }}
          >
            <TouchableOpacity onPress={() => scrollToSection(startRef)}>
              <Text style={{ fontSize: 18, marginVertical: 8, color: "#22223b" }}>Inici</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => scrollToSection(aboutRef)}>
              <Text style={{ fontSize: 18, marginVertical: 8, color: "#22223b" }}>Sobre mi</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => scrollToSection(projectsRef)}>
              <Text style={{ fontSize: 18, marginVertical: 8, color: "#22223b" }}>Projectes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => scrollToSection(contactRef)}>
              <Text style={{ fontSize: 18, marginVertical: 8, color: "#22223b" }}>Contacte</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <AnimatedScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={true}
        pagingEnabled={true}
      >
        <Animated.View // START SCREEN
          style={[
            {
              height: SCREEN_HEIGHT,
              alignItems: "center",
              justifyContent: "center",
            },
            animatedStyle,
          ]}
          ref={startRef}
        >
          <View style={StyleSheet.absoluteFill}>
            <PointCube />
          </View>

          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
              pointerEvents: "box-none",
            }}
          >
            <MotionText
              style={{
                color: "white",
                fontSize: 48,
                fontWeight: "bold",
                textTransform: "uppercase",
                textAlign: "center",
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5 }}
            >
              BUILDING{" "}
              <AnimatePresence mode="wait">
                <MotionText
                  key={words[wordIndex]}
                  style={{
                    fontWeight: "bold",
                    fontSize: 48,
                    textTransform: "uppercase",
                    textAlign: "center",
                    color: colors[wordIndex],
                    display: "inline-block",
                    width: 350,
                  }}
                  initial={{ opacity: 0, rotateX: 90 }}
                  animate={{ opacity: 1, rotateX: 0 }}
                  exit={{ opacity: 0, rotateX: -90 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {words[wordIndex]}
                </MotionText>
              </AnimatePresence>{" "}
              USER EXPERIENCES
            </MotionText>
          </View>
          <StatusBar style="auto" />
        </Animated.View>

        <Animated.View // ABOUT ME SCREEN
          style={[
            {
              minHeight: SCREEN_HEIGHT,
              padding: 32,
              flexDirection: "row",
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
            },
            animatedStyle,
          ]}
          ref={aboutRef}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-end",
              paddingRight: 24,
            }}
          >
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  color: "black",
                  fontSize: 40,
                  fontWeight: "bold",
                  marginBottom: 12,
                  textAlign: "right",
                }}
              >
                Biel Olivé
              </Text>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    "https://www.google.com/maps/place/Manresa,+Barcelona,+Catalonia"
                  )
                }
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    color: "#888",
                    fontSize: 18,
                    textAlign: "right",
                    textDecorationLine: "underline",
                  }}
                >
                  📍 Manresa, Barcelona, Catalonia
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Vertical Divider */}
          <View
            style={{
              width: 1,
              height: 120,
              backgroundColor: "#ccc",
              marginHorizontal: 24,
              alignSelf: "center",
            }}
          />

          <View
            style={{
              flex: 2,
              justifyContent: "center",
              alignItems: "flex-start",
              paddingLeft: 24,
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: 18,
                textAlign: "left",
                lineHeight: 32,
                marginBottom: 8,
              }}
            >
              {(() => {
                const birthDate = new Date(2004, 1, 12);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const hasHadBirthday =
                  today.getMonth() > birthDate.getMonth() ||
                  (today.getMonth() === birthDate.getMonth() &&
                    today.getDate() >= birthDate.getDate());
                if (!hasHadBirthday) age--;
                return `Hi! I'm Biel, a ${age} years old developer who builds beautiful and interactive user experiences.\nIn this portfolio, you'll find my personal projects.\nFeel free to explore and discover more about my work!`;
              })()}
            </Text>
          </View>
        </Animated.View>

        <Animated.View // PROJECTS SCREEN
          style={[
            {
              minHeight: SCREEN_HEIGHT,
              padding: 32,
              backgroundColor: "#f7f7f7",
              alignItems: "center",
              justifyContent: "center",
            },
            animatedStyle,
          ]}
          ref={projectsRef}
        >
          <Text
            style={{
              color: "#222",
              fontSize: 36,
              fontWeight: "bold",
              marginBottom: 24,
              textAlign: "center",
              textTransform: "uppercase",
              letterSpacing: 2,
              paddingBottom: 80,
            }}
          >
            Projects
          </Text>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {projects.map((project, idx) => (
              <ShineCard
                key={project.title}
                style={{
                  backgroundColor: "white",
                  borderRadius: 16,
                  padding: 24,
                  marginBottom: 20,
                  width: "32%",
                  height: 150,
                  shadowColor: "#000",
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 2,
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
                onPress={() => {
                  setSelectedProject(project);
                  setModalVisible(true);
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {project.title}
                </Text>
              </ShineCard>
            ))}
          </View>
        </Animated.View>

        <Animated.View // CONTACT SCREEN
          style={[
            {
              minHeight: SCREEN_HEIGHT,
              padding: 32,
              backgroundColor: "#22223b",
              alignItems: "center",
              justifyContent: "center",
            },
            animatedStyle,
          ]}
          ref={contactRef}
        >
          <Text
            style={{
              fontSize: 36,
              fontWeight: "bold",
              marginBottom: 24,
              textAlign: "center",
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            Contact
          </Text>
          <Text
            style={{
              fontSize: 18,
              textAlign: "center",
              marginBottom: 32,
              lineHeight: 28,
              maxWidth: 500,
            }}
          >
            Want to get in touch? Feel free to reach out for collaborations,
            questions, or just to say hi!
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              padding: 10,
            }}
          >
            <SocialButton iconSvg={emailSvg} text="Email" iconColor="#FF69B4" />
            <SocialButton
              iconSvg={linkedinSvg}
              text="Linked In"
              iconColor="#0e76a8"
            />
            <SocialButton iconSvg={githubSvg} text="Github" iconColor="#333" />
          </View>
        </Animated.View>
      </AnimatedScrollView>

      {/* MODAL SKELETON SECTION */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <motion.View
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              backgroundColor: "black",
              borderRadius: 0,
              padding: 30,
              width: "100%",
              height: "100%",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0,
              shadowRadius: 0,
              elevation: 0,
            }}
          >
            <ScrollView
              style={{ flex: 1, width: "100%" }}
              contentContainerStyle={{
                alignItems: "center",
                paddingBottom: 60,
              }}
              showsVerticalScrollIndicator={false}
              onScroll={onScroll}
              scrollEventThrottle={16}
            >
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  position: "absolute",
                  top: 30,
                  right: 30,
                  zIndex: 1,
                  padding: 8,
                }}
              >
                <Icon name="close" size={24} color="#555" />
              </TouchableOpacity>

              <Text
                style={{
                  position: "absolute",
                  top: 40,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  fontSize: 100,
                  fontWeight: "100",
                  color: "#fff",
                  marginBottom: 15,
                  zIndex: 1,
                  pointerEvents: "none",
                }}
              >
                {selectedProject?.title}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  width: "100%",
                  marginBottom: 30,
                  marginTop: 180,
                }}
              >
                <View
                  style={{
                    flex: 2,
                    marginRight: 250,
                    marginLeft: 64,
                    alignItems: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#bbb",
                      fontWeight: 15,
                      letterSpacing: 1,
                      marginBottom: 6,
                      textTransform: "uppercase",
                    }}
                  >
                    DESCRIPTION
                  </Text>
                  <View
                    style={{
                      height: 2,
                      backgroundColor: "#444",
                      opacity: 0.8,
                      width: 280,
                      marginBottom: 12,
                      alignItems: "flex-start",
                      marginRight: 2000,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 17,
                      color: "#fff",
                      lineHeight: 24,
                      fontWeight: 15,
                    }}
                  >
                    {selectedProject?.description}
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#bbb",
                      fontWeight: 15,
                      letterSpacing: 1,
                      marginBottom: 6,
                      textTransform: "uppercase",
                    }}
                  >
                    TECHNOLOGIES
                  </Text>
                  <View
                    style={{
                      height: 2,
                      backgroundColor: "#444",
                      opacity: 0.8,
                      width: 240,
                      marginBottom: 12,
                      alignSelf: "flex-start",
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#fff",
                      textAlign: "center",
                      marginBottom: 5,
                      fontWeight: 15,
                    }}
                  >
                    Frontend: {selectedProject?.frontend || "N/A"}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#fff",
                      textAlign: "center",
                      marginBottom: 5,
                      fontWeight: 15,
                    }}
                  >
                    Backend: {selectedProject?.backend || "N/A"}
                  </Text>
                </View>
              </View>

              <View style={{ width: 800, height: 500, alignSelf: "center", marginTop: 40, marginBottom: 40 }}>
                <View
                  style={{
                    position: "absolute",
                    top: -20,
                    left: -20,
                    right: -20,
                    bottom: -20,
                    borderRadius: 32,
                    backgroundColor: selectedProject?.color_theme,
                    opacity: 0.15,
                    zIndex: 0,
                    shadowColor: selectedProject?.color_theme,
                    shadowOpacity: 0.7,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 0 },
                    filter: Platform.OS === "web" ? "blur(32px)" : undefined,
                  }}
                  pointerEvents="none"
                />
                <Image
                  source={{
                    uri: selectedProject?.images?.[0],
                  }}
                  style={{
                    width: 800,
                    height: 500,
                    borderRadius: 24,
                    alignSelf: "center",
                    resizeMode: "cover",
                    borderWidth: 1,
                    borderOpacity: 0.5,
                    borderColor: selectedProject?.color_theme,
                    zIndex: 1,
                  }}
                />
              </View>
            </ScrollView>
          </motion.View>
        </View>
      </Modal>
    </>
  );
}
