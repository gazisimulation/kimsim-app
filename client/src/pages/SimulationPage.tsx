import { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Clock, ArrowLeft, FlaskRound, Beaker, BookOpen, HelpCircle, Atom } from 'lucide-react';
import AcidBaseTitrationSimulator from '@/components/simulations/AcidBaseTitrationSimulator';
import QuantumAtomModelSimulator from '@/components/simulations/QuantumAtomModelSimulator';
import ChemicalBondsSimulator from '@/components/simulations/ChemicalBondsSimulator';
import StateChangeSimulator from '@/components/simulations/StateChangeSimulator';
import GasLawsSimulator from '@/components/simulations/GasLawsSimulator';
import BatterySimulator from '@/components/simulations/BatterySimulator';
import ChemistryCalculatorsSimulator from '@/components/simulations/ChemistryCalculatorsSimulator';
import type { Simulation } from '@/types';

const SimulationPage = () => {
  const [, params] = useRoute('/simulations/:slug');
  const slug = params?.slug || '';
  const [activeTab, setActiveTab] = useState('simulation');

  const {
    data: simulation,
    isLoading,
    isError,
  } = useQuery<Simulation>({
    queryKey: [`/api/simulations/${slug}`],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (isError || !simulation) {
    return (
      <div className="flex justify-center items-center min-h-screen text-center p-4">
        <div>
          <h2 className="text-xl font-bold text-red-500 mb-2">Simülasyon Bulunamadı</h2>
          <p className="text-gray-400 mb-4">Aradığınız simülasyon mevcut değil veya taşınmış.</p>
          <Button asChild>
            <Link href="/">
              <a>Ana Sayfaya Dön</a>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const renderSimulator = (slug: string) => {
    switch (slug) {
      case 'acid-base-titration':
        return <AcidBaseTitrationSimulator />;
      case 'quantum-atom-model':
        return <QuantumAtomModelSimulator />;
      case 'chemical-bonds':
        return <ChemicalBondsSimulator />;
      case 'state-change':
        return <StateChangeSimulator />;
      case 'gas-laws':
        return <GasLawsSimulator />;
      case 'battery-simulator':
        return <BatterySimulator />;
      case 'chemistry-calculators':
        return <ChemistryCalculatorsSimulator />;
      default:
        return (
          <div className="p-8 text-center">
            <Beaker className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Simülasyon Geliştiriliyor</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Bu simülasyon şu anda geliştiriliyor ve yakında kullanıma sunulacak.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="py-12 px-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-heading font-bold">{simulation.title}</h2>
          <Button variant="ghost" asChild>
            <Link href="/">
              <a className="text-primary-500 hover:text-primary-400 flex items-center">
                <ArrowLeft className="mr-1 h-4 w-4" /> Simülasyonlara Dön
              </a>
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="w-full md:w-8/12">
            <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
              <img
                src={simulation.imageUrl}
                alt={simulation.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>
          </div>
          <div className="w-full md:w-4/12">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold mb-4">Simülasyon Detayları</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Kategori</span>
                    <div className="flex items-center">
                      <FlaskRound className="h-4 w-4 mr-1" />
                      <span>{simulation.category.charAt(0).toUpperCase() + simulation.category.slice(1)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Süre</span>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{simulation.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Zorluk</span>
                    <Badge>{simulation.difficulty}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {simulation.isNew && <Badge variant="secondary">Yeni</Badge>}
                    {simulation.isPopular && <Badge>Popüler</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Simulation Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          {/* Navigation tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-gray-100 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <TabsList className="bg-transparent">
                <TabsTrigger value="simulation" className="data-[state=active]:text-primary-500 data-[state=active]:border-b-2 data-[state=active]:border-primary-500">
                  <Beaker className="h-4 w-4 mr-2" /> Simülasyon
                </TabsTrigger>
                <TabsTrigger value="instructions" className="data-[state=active]:text-primary-500 data-[state=active]:border-b-2 data-[state=active]:border-primary-500">
                  <HelpCircle className="h-4 w-4 mr-2" /> Talimatlar
                </TabsTrigger>
                <TabsTrigger value="theory" className="data-[state=active]:text-primary-500 data-[state=active]:border-b-2 data-[state=active]:border-primary-500">
                  <BookOpen className="h-4 w-4 mr-2" /> Teori
                </TabsTrigger>
                <TabsTrigger value="questions" className="data-[state=active]:text-primary-500 data-[state=active]:border-b-2 data-[state=active]:border-primary-500">
                  <Atom className="h-4 w-4 mr-2" /> Sorular
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Tab content */}
            <div className="p-6">
              <TabsContent value="simulation" className="mt-0">
                {renderSimulator(simulation.slug)}
              </TabsContent>
              
              <TabsContent value="instructions" className="mt-0">
                <div className="max-w-3xl mx-auto py-6">
                  <h3 className="text-2xl font-bold mb-4">Bu Simülasyonu Nasıl Kullanılır</h3>
                  <div className="prose dark:prose-invert">
                    {simulation.slug === 'acid-base-titration' ? (
                      <>
                        <p>Bu simülasyon, güçlü bir asit ve güçlü bir baz arasında sanal bir titrasyon deneyi yapmanızı sağlar. Başlamak için aşağıdaki adımları izleyin:</p>
                        <ol>
                          <li><strong>Analit Türü</strong> açılır menüsünü kullanarak bir asidi bir bazla mı yoksa bir bazı bir asitle mi titre etmek istediğinizi seçin.</li>
                          <li><strong>Analit Hacmi</strong>ni mililitre cinsinden ayarlayın.</li>
                          <li><strong>Analit Konsantrasyonu</strong>nu molarite (M) cinsinden ayarlayın.</li>
                          <li><strong>Titrant Konsantrasyonu</strong>nu molarite (M) cinsinden ayarlayın.</li>
                          <li>Titrant eklemek ve pH değişimlerini gözlemlemek için <strong>kaydırıcıyı</strong> kullanın.</li>
                          <li>Titrasyon eğrisinin gerçek zamanlı olarak oluşturulmasını izleyin.</li>
                          <li>Eklenen titrant miktarının stokiyometrik olarak analit miktarına eşit olduğu yeri gösteren <strong>Eşdeğerlik Noktası</strong>nı not edin.</li>
                          <li>Fenolftalein indikatörünün renk değiştirdiği zaman (yaklaşık pH 8.2) flakondaki <strong>renk değişimini</strong> gözlemleyin.</li>
                        </ol>
                        <p>Sıfırla düğmesini kullanarak simülasyonu istediğiniz zaman sıfırlayabilirsiniz.</p>
                      </>
                    ) : simulation.slug === 'quantum-atom-model' ? (
                      <>
                        <p>Bu simülasyon, atomun kuantum mekanik modelinde farklı atomik orbitalleri görselleştirmenizi sağlar. Simülasyonla etkileşim kurmak için şu adımları izleyin:</p>
                        <ol>
                          <li>Farklı orbitalleri (1s, 2s, 2p, 3s, 3p, 3d) seçmek için <strong>Orbital Türü</strong> açılır menüsünü kullanın.</li>
                          <li>3B görselleştirmeyi döndürmek ve orbitali farklı açılardan görmek için farenizle <strong>sürükleyin</strong>.</li>
                          <li>Yakınlaştırmak ve uzaklaştırmak için farenizin <strong>kaydırma tekerleğini</strong> kullanın.</li>
                          <li>Her orbital türünün farklı şekillerini gözlemleyin:</li>
                          <ul>
                            <li><strong>s orbitalleri</strong> (1s, 2s, 3s): Küresel şekil</li>
                            <li><strong>p orbitalleri</strong> (2p, 3p): İki loblu dambıl şekli</li>
                            <li><strong>d orbitalleri</strong> (3d): Karmaşık dört loblu şekiller</li>
                          </ul>
                          <li>Her orbitalin özellikleri hakkında bilgi edinmek için <strong>Orbital Bilgisi</strong> bölümünü okuyun.</li>
                        </ol>
                        <p>Görünümü Sıfırla düğmesini kullanarak görünümü istediğiniz zaman sıfırlayabilirsiniz.</p>
                      </>
                    ) : simulation.slug === 'chemical-bonds' ? (
                      <>
                        <p>Bu simülasyon, üç temel kimyasal bağ türünü 3B olarak keşfetmenizi sağlar. Simülasyonu kullanmak için şu adımları izleyin:</p>
                        <ol>
                          <li>Üstteki sekmeleri kullanarak bir bağ türü seçin:</li>
                          <ul>
                            <li><strong>Metalik</strong>: "Elektron denizi" ile bir metal kafes gösterir</li>
                            <li><strong>İyonik</strong>: Sodyum klorür (NaCl) kristal yapısını gösterir</li>
                            <li><strong>Kovalent</strong>: Paylaşılan elektron çiftleriyle bir su molekülünü (H₂O) gösterir</li>
                          </ul>
                          <li>3B görselleştirmeyi döndürmek ve yapıyı farklı açılardan incelemek için farenizle <strong>sürükleyin</strong>.</li>
                          <li>Yakınlaştırmak ve uzaklaştırmak için farenizin <strong>kaydırma tekerleğini</strong> kullanın.</li>
                          <li>Her bağ türüne özgü davranışları ve özellikleri gözlemleyin:</li>
                          <ul>
                            <li><strong>Metalik bağda</strong>, elektronların (mavi küreler) metal kafes boyunca nasıl serbestçe hareket ettiğini izleyin.</li>
                            <li><strong>İyonik bağda</strong>, değişen pozitif ve negatif iyonları ve aralarındaki elektrostatik alan çizgilerini fark edin.</li>
                            <li><strong>Kovalent bağda</strong>, elektronların atomlar arasında nasıl paylaşıldığını ve bunun sonucunda oluşan moleküler polariteyi gözlemleyin.</li>
                          </ul>
                        </ol>
                        <p>Her bağ türünün özelliklerini ve kimyadaki önemini anlamak için bağ türlerine ait açıklamaları okumak için zaman ayırın.</p>
                      </>
                    ) : simulation.slug === 'state-change' ? (
                      <>
                        <p>Bu simülasyon, özelleştirilebilir parametrelerle farklı maddelerin faz geçişlerini keşfetmenizi sağlar. Simülasyonu kullanmak için şu adımları izleyin:</p>
                        <ol>
                          <li>Açılır menüden bir <strong>madde</strong> seçin (Su, Demir veya Azot).</li>
                          <li>Faz değişimleri için gereken enerjiyi nasıl etkilediğini görmek için maddenin <strong>kütlesini</strong> (gram cinsinden) ayarlayın.</li>
                          <li>Sistemden ne kadar hızlı enerji eklendiğini veya çıkarıldığını kontrol etmek için <strong>ısıtma/soğutma hızını</strong> değiştirin.</li>
                          <li>Simülasyonun ne kadar hızlı çalıştığını ayarlamak için <strong>simülasyon hızı</strong> kaydırıcısını kullanın.</li>
                          <li>Maddeye ısı enerjisi eklemek ve sıcaklık arttıkça faz geçişlerini gözlemlemek için <strong>Isıt</strong> düğmesine tıklayın.</li>
                          <li>Isı enerjisini çıkarmak ve maddenin daha düşük enerji durumlarına geçişini izlemek için <strong>Soğut</strong> düğmesine tıklayın.</li>
                          <li>Isıtma veya soğutma işlemini duraklatmak için <strong>Durdur</strong> düğmesini kullanın.</li>
                          <li>Maddenin katı, sıvı ve gaz fazları arasında nasıl değiştiğini gözlemleyin:</li>
                          <ul>
                            <li><strong>Erime</strong> ve <strong>kaynama</strong> sırasında, enerji hala ekleniyorken sıcaklığın nasıl sabit kaldığını fark edin (gizli ısı).</li>
                            <li>Maddenin her fazı için farklı ısı kapasitelerini not edin.</li>
                            <li>Üç maddenin farklı erime ve kaynama noktalarını karşılaştırın.</li>
                          </ul>
                        </ol>
                        <p>Simülasyonun sağ tarafı, maddenin mevcut durumu, sıcaklığı ve enerjisi hakkında ayrıntılı verilerin yanı sıra ısı kapasitesi ve gizli ısı değerleri gibi maddeye özgü özellikleri gösterir.</p>
                      </>
                    ) : simulation.slug === 'gas-laws' ? (
                      <>
                        <p>Bu simülasyon, gaz davranışını ve basınç, hacim, sıcaklık ve gaz mol sayısı arasındaki ilişkileri keşfetmenizi sağlar. Simülasyonu kullanmak için şu adımları izleyin:</p>
                        <ol>
                          <li>Gaz davranışının farklı yönlerini keşfetmek için dört sekme arasında gezinin:
                            <ul>
                              <li><strong>İdeal Gaz Yasası</strong>: Gaz parametreleri (P, V, T, n) arasındaki ilişkileri keşfedin</li>
                              <li><strong>Kinetik Teori</strong>: Moleküler hareketi ve hız dağılımını görselleştirin</li>
                              <li><strong>Gaz Karışımları</strong>: Dalton'un Kısmi Basınçlar Yasasını keşfedin</li>
                              <li><strong>Gerçek Gazlar</strong>: İdeal ve ideal olmayan (Van der Waals) gaz davranışlarını karşılaştırın</li>
                            </ul>
                          </li>
                          <li>Her sekme için:
                            <ul>
                              <li>Özellikleri karşılaştırmak için açılır menüden farklı <strong>gaz türleri</strong> seçin</li>
                              <li>Parametreleri <strong>kaydırıcıları</strong> kullanarak ayarlayın:
                                <ul>
                                  <li>Gaz mol sayısı (n)</li>
                                  <li>Sıcaklık (T) Kelvin cinsinden</li>
                                  <li>Basınç (P) atmosfer cinsinden</li>
                                  <li>Hacim (V) litre cinsinden (bazı sekmelerde)</li>
                                </ul>
                              </li>
                            </ul>
                          </li>
                          <li><strong>İdeal Gaz Yasası</strong> sekmesinde:
                            <ul>
                              <li>Gaz yasası modelini seçin (İdeal veya Van der Waals)</li>
                              <li>Farklı grafik türleri seçin (basınç-hacim, basınç-sıcaklık, vb.)</li>
                              <li>Parametreleri değiştirmenin grafikleri nasıl etkilediğini gözlemleyin</li>
                            </ul>
                          </li>
                          <li><strong>Kinetik Teori</strong> sekmesinde:
                            <ul>
                              <li>Sıcaklıkla moleküler hareketin nasıl değiştiğini görmek için parçacık simülasyonunu izleyin</li>
                              <li>Maxwell-Boltzmann dağılımını görselleştirmek için hız dağılımı histogramını açıp kapatın</li>
                            </ul>
                          </li>
                          <li><strong>Gaz Karışımları</strong> sekmesinde:
                            <ul>
                              <li>İki farklı gaz seçin ve oranlarını ayarlayın</li>
                              <li>Dalton Yasasına dayalı olarak kısmi basınçların nasıl değiştiğini gözlemleyin</li>
                            </ul>
                          </li>
                          <li><strong>Gerçek Gazlar</strong> sekmesinde:
                            <ul>
                              <li>Çeşitli basınç ve sıcaklıklarda ideal ve gerçek gaz davranışlarını karşılaştırın</li>
                              <li>Modeller arasındaki sapma yüzdesini görün</li>
                              <li>Farklı gazlar için Van der Waals parametreleri hakkında bilgi edinin</li>
                            </ul>
                          </li>
                        </ol>
                        <p>Tüm grafikler ve görselleştirmeler, parametreleri ayarladıkça gerçek zamanlı olarak güncellenir ve gaz değişkenleri arasındaki ilişkileri dinamik olarak gözlemlemenizi sağlar.</p>
                      </>
                    ) : (
                      <p>Bu simülasyon için talimatlar yakında eklenecektir.</p>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="theory" className="mt-0">
                <div className="max-w-3xl mx-auto py-6">
                  <h3 className="text-2xl font-bold mb-4">Teorik Arka Plan</h3>
                  <div className="prose dark:prose-invert">
                    {simulation.slug === 'acid-base-titration' ? (
                      <>
                        <h4>Asit-Baz Titrasyonu</h4>
                        <p>Asit-baz titrasyonu, analitik kimyada bir asit veya bazın konsantrasyonunu, bilinen konsantrasyondaki bir baz veya asit standart çözeltisiyle tam olarak nötralize ederek belirlemek için kullanılan bir yöntemdir.</p>
                        
                        <h4>Titrasyon Eğrisi</h4>
                        <p>Titrasyon eğrisi, eklenen titrant miktarının bir fonksiyonu olarak pH'ı gösterir. Güçlü asit-güçlü baz titrasyonu için eğrinin birkaç önemli bölgesi vardır:</p>
                        <ul>
                          <li><strong>Eşdeğerlik noktasından önce:</strong> pH, fazla analite bağlıdır.</li>
                          <li><strong>Eşdeğerlik noktasında:</strong> Güçlü asit-güçlü baz titrasyonu için pH 7.0'dır.</li>
                          <li><strong>Eşdeğerlik noktasından sonra:</strong> pH, fazla titranta bağlıdır.</li>
                        </ul>
                        
                        <h4>pH Hesaplamaları</h4>
                        <p>Titrasyon sırasında herhangi bir noktadaki pH, H+ iyonlarının konsantrasyonuna dayanarak hesaplanır:</p>
                        <ul>
                          <li>Asitler için: pH = -log[H+]</li>
                          <li>Bazlar için: pH = 14 - (-log[OH-]) = 14 - pOH</li>
                        </ul>
                        
                        <h4>İndikatörler</h4>
                        <p>İndikatörler, belirli pH değerlerinde renk değiştiren maddelerdir. Fenolftalein, asit-baz titrasyonlarında yaygın olarak kullanılır ve renksizden (pH &lt; 8.2) pembeye (pH &gt; 8.2) değişir.</p>
                      </>
                    ) : simulation.slug === 'quantum-atom-model' ? (
                      <>
                        <h4>Atomun Kuantum Mekanik Modeli</h4>
                        <p>Atomun kuantum mekanik modeli, kuantum fiziği ilkelerine dayanır ve Bohr'un modeli gibi daha önceki atom modellerine göre önemli bir ilerlemeyi temsil eder. Bu modelde, elektronlar çekirdeğin etrafında sabit yörüngelerde hareket etmez, bunun yerine orbital adı verilen olasılık bölgelerinde bulunurlar.</p>
                        
                        <h4>Atomik Orbitaller</h4>
                        <p>Orbital, çekirdeğin etrafında bir elektronun bulunma olasılığının yüksek olduğu (genellikle %90-95) üç boyutlu bir bölgedir. Her orbital, zıt spinlere sahip maksimum iki elektron içerebilir.</p>
                        <p>Orbitaller üç kuantum sayısıyla tanımlanır:</p>
                        <ul>
                          <li><strong>Temel kuantum sayısı (n):</strong> Orbitalin enerji seviyesini ve boyutunu belirler (1, 2, 3, vb.)</li>
                          <li><strong>Açısal momentum kuantum sayısı (l):</strong> Orbitalin şeklini belirler (s için 0, p için 1, d için 2, vb.)</li>
                          <li><strong>Manyetik kuantum sayısı (m<sub>l</sub>):</strong> Orbitalin uzaydaki yönünü belirler</li>
                        </ul>
                        
                        <h4>Orbital Türleri</h4>
                        <ul>
                          <li><strong>s orbitalleri (l=0):</strong> Çekirdek merkezli küresel şekil. Her enerji seviyesinde bir orbital.</li>
                          <li><strong>p orbitalleri (l=1):</strong> Nodal düzlemle ayrılmış iki loblu dambıl şekli. Her enerji seviyesinde üç orbital (p<sub>x</sub>, p<sub>y</sub>, p<sub>z</sub>).</li>
                          <li><strong>d orbitalleri (l=2):</strong> Genellikle dört loblu daha karmaşık şekiller. Her enerji seviyesinde beş orbital.</li>
                          <li><strong>f orbitalleri (l=3):</strong> Daha da karmaşık şekiller. Her enerji seviyesinde yedi orbital.</li>
                        </ul>
                        
                        <h4>Elektron Olasılık Yoğunluğu</h4>
                        <p>Dalga fonksiyonu (Ψ), bir elektronun kuantum durumunu tanımlar. Bu fonksiyonun karesi (Ψ²), elektronun uzayda belirli bir noktada bulunma olasılık yoğunluğunu verir. Bu, simülasyonda gösterilen "elektron bulutu" veya "olasılık bulutu"nu oluşturur.</p>
                      </>
                    ) : simulation.slug === 'chemical-bonds' ? (
                      <>
                        <h4>Chemical Bonding</h4>
                        <p>Chemical bonds are forces that hold atoms together in molecules or compounds. The three primary types of chemical bonds are metallic, ionic, and covalent bonds, each with distinct properties and mechanisms.</p>
                        
                        <h4>Metallic Bonding</h4>
                        <p>Metallic bonding occurs in metals where positive metal ions form a lattice structure while their valence electrons become delocalized, forming a "sea of electrons" that moves freely throughout the structure. This explains key properties of metals:</p>
                        <ul>
                          <li><strong>Electrical conductivity:</strong> Free electrons can carry electric current</li>
                          <li><strong>Thermal conductivity:</strong> Energy can be easily transferred through the electron sea</li>
                          <li><strong>Malleability and ductility:</strong> Metal ions can slide past each other while maintaining the bond</li>
                          <li><strong>Metallic luster:</strong> Free electrons can absorb and emit photons of light</li>
                        </ul>
                        
                        <h4>Ionic Bonding</h4>
                        <p>Ionic bonding forms between metals and non-metals through the complete transfer of electrons. The metal atom loses electrons to become a positively charged ion (cation), while the non-metal atom gains electrons to become a negatively charged ion (anion). Electrostatic attraction between these oppositely charged ions creates the ionic bond.</p>
                        <p>Properties of ionic compounds include:</p>
                        <ul>
                          <li>High melting and boiling points</li>
                          <li>Brittle crystalline structure</li>
                          <li>Electrical conductivity when dissolved in water or melted</li>
                          <li>Solubility in polar solvents</li>
                        </ul>
                        
                        <h4>Covalent Bonding</h4>
                        <p>Covalent bonding occurs when atoms share electron pairs rather than transferring them. This typically happens between non-metal atoms. The shared electrons orbit around both nuclei, creating a strong bond.</p>
                        <p>Covalent bonds can be:</p>
                        <ul>
                          <li><strong>Non-polar:</strong> When electrons are shared equally (e.g., H<sub>2</sub>, O<sub>2</sub>)</li>
                          <li><strong>Polar:</strong> When electrons are unequally shared due to electronegativity differences (e.g., H<sub>2</sub>O)</li>
                        </ul>
                        <p>Properties of covalent compounds include:</p>
                        <ul>
                          <li>Lower melting and boiling points (compared to ionic compounds)</li>
                          <li>Poor electrical conductivity</li>
                          <li>Variable solubility depending on polarity</li>
                        </ul>
                      </>
                    ) : simulation.slug === 'state-change' ? (
                      <>
                        <h4>States of Matter</h4>
                        <p>Matter can exist in various states, primarily solid, liquid, and gas. Each state has distinct properties based on the arrangement and movement of particles:</p>
                        <ul>
                          <li><strong>Solid:</strong> Particles are tightly packed in a regular pattern with strong intermolecular forces, giving solids a fixed shape and volume.</li>
                          <li><strong>Liquid:</strong> Particles are close together but can move past each other, allowing liquids to flow and take the shape of their container while maintaining a fixed volume.</li>
                          <li><strong>Gas:</strong> Particles are widely separated with minimal intermolecular forces, allowing gases to expand to fill their container.</li>
                        </ul>
                        
                        <h4>Phase Transitions</h4>
                        <p>When substances change from one state to another, they undergo phase transitions. The major phase transitions are:</p>
                        <ul>
                          <li><strong>Melting (fusion):</strong> Solid → Liquid</li>
                          <li><strong>Freezing:</strong> Liquid → Solid</li>
                          <li><strong>Vaporization (boiling):</strong> Liquid → Gas</li>
                          <li><strong>Condensation:</strong> Gas → Liquid</li>
                          <li><strong>Sublimation:</strong> Solid → Gas</li>
                          <li><strong>Deposition:</strong> Gas → Solid</li>
                        </ul>
                        
                        <h4>Heat and Temperature</h4>
                        <p>Temperature is a measure of the average kinetic energy of particles in a substance. Heat is the total energy that flows between substances due to temperature differences.</p>
                        <p>When heat is added to or removed from a substance, one of two things happens:</p>
                        <ol>
                          <li>The temperature changes if the substance remains in the same phase</li>
                          <li>A phase change occurs at constant temperature if the substance is at its melting or boiling point</li>
                        </ol>
                        
                        <h4>Heat Capacity</h4>
                        <p>Heat capacity (c) is the amount of heat needed to raise the temperature of a substance by one degree. It varies between phases of the same substance:</p>
                        <p>The energy required to change the temperature is calculated using: Q = mc∆T where:</p>
                        <ul>
                          <li>Q = energy (heat) in joules</li>
                          <li>m = mass in grams</li>
                          <li>c = specific heat capacity in J/g·°C</li>
                          <li>∆T = temperature change in °C</li>
                        </ul>
                        
                        <h4>Latent Heat</h4>
                        <p>Latent heat is the energy required to change the phase of a substance without changing its temperature:</p>
                        <ul>
                          <li><strong>Latent heat of fusion:</strong> Energy required to convert a solid to a liquid at its melting point</li>
                          <li><strong>Latent heat of vaporization:</strong> Energy required to convert a liquid to a gas at its boiling point</li>
                        </ul>
                        <p>The energy required for a phase change is calculated using: Q = mL where:</p>
                        <ul>
                          <li>Q = energy (heat) in joules</li>
                          <li>m = mass in grams</li>
                          <li>L = latent heat in J/g</li>
                        </ul>
                      </>
                    ) : simulation.slug === 'gas-laws' ? (
                      <>
                        <h4>Properties of Gases</h4>
                        <p>Gases have several unique properties that distinguish them from solids and liquids:</p>
                        <ul>
                          <li>They have no definite shape or volume and expand to fill their container</li>
                          <li>They are easily compressible compared to liquids and solids</li>
                          <li>They have lower density than liquids and solids</li>
                          <li>Gas particles move randomly with high kinetic energy</li>
                          <li>Gas particles have negligible interactions except during collisions</li>
                        </ul>
                        
                        <h4>Ideal Gas Law</h4>
                        <p>The Ideal Gas Law is a fundamental equation that relates the four macroscopic properties of gases:</p>
                        <p className="text-center font-medium my-2">PV = nRT</p>
                        <p>Where:</p>
                        <ul>
                          <li><strong>P</strong> = pressure (atm, Pa, or other pressure units)</li>
                          <li><strong>V</strong> = volume (L, m³, or other volume units)</li>
                          <li><strong>n</strong> = number of moles of gas</li>
                          <li><strong>R</strong> = gas constant (0.08206 L·atm/mol·K)</li>
                          <li><strong>T</strong> = absolute temperature (K)</li>
                        </ul>
                        <p>This equation is derived from the combination of Boyle's Law (P ∝ 1/V), Charles's Law (V ∝ T), and Avogadro's Law (V ∝ n).</p>
                        
                        <h4>Kinetic Theory of Gases</h4>
                        <p>The Kinetic Molecular Theory explains the behavior of gases at the molecular level:</p>
                        <ul>
                          <li>Gas particles are in constant, random motion</li>
                          <li>Collisions between gas particles and with container walls are perfectly elastic</li>
                          <li>The average kinetic energy of gas particles is proportional to absolute temperature</li>
                          <li>Gas particles have negligible volume compared to the container</li>
                          <li>There are no attractive or repulsive forces between particles</li>
                        </ul>
                        
                        <h4>Maxwell-Boltzmann Distribution</h4>
                        <p>This distribution describes the range of molecular speeds in a gas at a given temperature:</p>
                        <ul>
                          <li><strong>Most probable speed (v<sub>mp</sub>):</strong> The speed at which most molecules are moving</li>
                          <li><strong>Average speed (v<sub>avg</sub>):</strong> The arithmetic mean of all molecular speeds</li>
                          <li><strong>Root mean square speed (v<sub>rms</sub>):</strong> √(3RT/M) where M is molar mass in kg/mol</li>
                        </ul>
                        <p>At higher temperatures, the distribution shifts toward higher speeds, and lighter gases have higher average speeds at the same temperature.</p>
                        
                        <h4>Gas Mixtures and Dalton's Law</h4>
                        <p>Dalton's Law of Partial Pressures states that in a mixture of non-reacting gases, the total pressure is the sum of the partial pressures of each individual gas:</p>
                        <p className="text-center font-medium my-2">P<sub>total</sub> = P<sub>1</sub> + P<sub>2</sub> + ... + P<sub>n</sub></p>
                        <p>The partial pressure of each gas is proportional to its mole fraction in the mixture:</p>
                        <p className="text-center font-medium my-2">P<sub>i</sub> = x<sub>i</sub> × P<sub>total</sub></p>
                        <p>where x<sub>i</sub> is the mole fraction (n<sub>i</sub>/n<sub>total</sub>).</p>
                        
                        <h4>Real Gases and Van der Waals Equation</h4>
                        <p>Real gases deviate from ideal behavior, especially at high pressures and low temperatures. The Van der Waals equation accounts for:</p>
                        <ul>
                          <li>The actual volume of gas molecules (b term)</li>
                          <li>Attractive forces between molecules (a term)</li>
                        </ul>
                        <p className="text-center font-medium my-2">(P + a(n/V)²)(V - nb) = nRT</p>
                        <p>Where a and b are gas-specific constants:</p>
                        <ul>
                          <li>a accounts for attractive forces between molecules</li>
                          <li>b accounts for the finite volume of gas molecules</li>
                        </ul>
                        <p>At low pressures and high temperatures, the Van der Waals equation approaches the ideal gas law.</p>
                      </>
                    ) : (
                      <p>Theoretical background for this simulation will be available soon.</p>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="questions" className="mt-0">
                <div className="max-w-3xl mx-auto py-6">
                  <h3 className="text-2xl font-bold mb-4">Alıştırma Soruları</h3>
                  <div className="prose dark:prose-invert">
                    {simulation.slug === 'acid-base-titration' ? (
                      <>
                        <ol>
                          <li>If you have 50 mL of 0.1 M HCl, how many mL of 0.1 M NaOH would you need to reach the equivalence point?</li>
                          <li>What is the pH at the equivalence point of a strong acid-strong base titration?</li>
                          <li>How does the pH change when you're titrating a weak acid with a strong base compared to a strong acid with a strong base?</li>
                          <li>Why does the pH change slowly at first and then rapidly near the equivalence point?</li>
                          <li>If you double the concentration of both the analyte and titrant, how would this affect the volume needed to reach the equivalence point?</li>
                          <li>What is the purpose of using an indicator in a titration?</li>
                          <li>How would you select an appropriate indicator for an acid-base titration?</li>
                          <li>Calculate the pH when 24.5 mL of 0.1 M NaOH has been added to 50 mL of 0.1 M HCl.</li>
                        </ol>
                      </>
                    ) : simulation.slug === 'state-change' ? (
                      <>
                        <ol>
                          <li>How much energy is required to convert 100g of ice at -10°C to water at 20°C? (Use water's heat capacity for solid = 2.108 J/g°C, latent heat of fusion = 333.55 J/g, heat capacity for liquid = 4.18 J/g°C)</li>
                          <li>Explain why the temperature remains constant during the melting and boiling processes, even though heat is continuously being added to the system.</li>
                          <li>Why does water have a higher specific heat capacity in its liquid state compared to its solid state?</li>
                          <li>Compare the melting and boiling points of water, iron, and nitrogen. Explain the differences in terms of intermolecular forces.</li>
                          <li>Calculate the total energy needed to convert 50g of water at 25°C to steam at 110°C.</li>
                          <li>If 500 J of heat is added to 20g of ice at 0°C, how much ice will melt? Will all of it melt?</li>
                          <li>Why does the density of most substances decrease as they transition from solid to liquid to gas? Why is water unusual in this regard?</li>
                          <li>How would increasing the mass of the substance affect the time needed to complete a phase change at a constant heating rate?</li>
                        </ol>
                      </>
                    ) : simulation.slug === 'gas-laws' ? (
                      <>
                        <ol>
                          <li>A gas occupies 2.5 L at 1.2 atm and 298 K. What will be its volume at 0.8 atm and 320 K?</li>
                          <li>If 1.5 moles of an ideal gas occupies 36.0 L at 300 K, what is the pressure in atmospheres?</li>
                          <li>What is the root mean square speed of oxygen (O<sub>2</sub>) molecules at 25°C? (Molar mass of O<sub>2</sub> = 32.0 g/mol)</li>
                          <li>Explain why gases deviate from ideal behavior at high pressures and low temperatures.</li>
                          <li>A gas mixture contains 0.25 mol of oxygen, 0.50 mol of nitrogen, and 0.15 mol of carbon dioxide. If the total pressure is 1.5 atm, what is the partial pressure of nitrogen?</li>
                          <li>Using the Van der Waals equation, calculate the volume of 1.0 mol of methane at 300 K and 5.0 atm. (For methane, a = 2.283 L²·atm/mol², b = 0.04278 L/mol)</li>
                          <li>Why do lighter gases diffuse faster than heavier gases at the same temperature?</li>
                          <li>Compare the molecular speeds of helium and nitrogen at 300 K. Which has the higher average kinetic energy?</li>
                          <li>If the temperature of a gas doubles (in Kelvin), how does it affect:
                            <ol type="a">
                              <li>The average kinetic energy of the molecules</li>
                              <li>The average speed of the molecules</li>
                              <li>The pressure (if volume is constant)</li>
                            </ol>
                          </li>
                          <li>Calculate the pressure exerted by 2.5 g of oxygen gas in a 1.5 L container at 25°C using both the ideal gas law and Van der Waals equation. Compare the results.</li>
                        </ol>
                      </>
                    ) : (
                      <p>Bu simülasyon için alıştırma soruları yakında eklenecektir.</p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SimulationPage;
