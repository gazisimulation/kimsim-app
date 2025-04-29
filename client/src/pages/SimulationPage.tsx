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
import onesim from '@/components/simulations/1';
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
      case 'onesim':
        return <onesim />;
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
                        <h4>Kimyasal Bağlanma</h4>
                        <p>Kimyasal bağlar, atomları moleküllerde veya bileşiklerde bir arada tutan kuvvetlerdir. Üç temel kimyasal bağ türü metalik, iyonik ve kovalent bağlardır ve her biri farklı özelliklere ve mekanizmalara sahiptir.</p>
                        
                        <h4>Metalik Bağlanma</h4>
                        <p>Metalik bağlanma, pozitif metal iyonlarının bir kafes yapısı oluştururken değerlik elektronlarının delokalize olduğu, yapı boyunca serbestçe hareket eden bir "elektron denizi" oluşturduğu metallerde meydana gelir. Bu, metallerin temel özelliklerini açıklar:</p>
                        <ul>
                          <li><strong>Elektriksel iletkenlik:</strong> Serbest elektronlar elektrik akımını taşıyabilir</li>
                          <li><strong>Isıl iletkenlik:</strong> Enerji, elektron denizi boyunca kolayca aktarılabilir</li>
                          <li><strong>Şekillendirilebilirlik ve sünek yapı:</strong> Metal iyonları, bağı korurken birbirleri üzerinden kayabilir</li>
                          <li><strong>Metalik parlaklık:</strong> Serbest elektronlar ışık fotonlarını soğurabilir ve yayabilir</li>
                        </ul>
                        
                        <h4>İyonik Bağlanma</h4>
                        <p>İyonik bağlanma, elektronların tam transferi yoluyla metaller ve ametaller arasında oluşur. Metal atomu, pozitif yüklü bir iyon (katyon) oluşturmak için elektron kaybederken, ametal atomu negatif yüklü bir iyon (anyon) oluşturmak için elektron kazanır. Bu zıt yüklü iyonlar arasındaki elektrostatik çekim, iyonik bağı oluşturur.</p>
                        <p>İyonik bileşiklerin özellikleri şunları içerir:</p>
                        <ul>
                          <li>Yüksek erime ve kaynama noktaları</li>
                          <li>Kırılgan kristal yapı</li>
                          <li>Suda çözündüğünde veya eritildiğinde elektriksel iletkenlik</li>
                          <li>Polar çözücülerde çözünürlük</li>
                        </ul>
                        
                        <h4>Kovalent Bağlanma</h4>
                        <p>Kovalent bağlanma, atomların elektronları aktarmak yerine elektron çiftlerini paylaştığında oluşur. Bu genellikle ametal atomlar arasında gerçekleşir. Paylaşılan elektronlar her iki çekirdek etrafında da dolanarak güçlü bir bağ oluşturur.</p>
                        <p>Kovalent bağlar şu şekilde olabilir:</p>
                        <ul>
                          <li><strong>Apolar:</strong> Elektronlar eşit olarak paylaşıldığında (örn., H<sub>2</sub>, O<sub>2</sub>)</li>
                          <li><strong>Polar:</strong> Elektronlar elektronegatiflik farklılıkları nedeniyle eşit olmayan şekilde paylaşıldığında (örn., H<sub>2</sub>O)</li>
                        </ul>
                        <p>Kovalent bileşiklerin özellikleri şunları içerir:</p>
                        <ul>
                          <li>Daha düşük erime ve kaynama noktaları (iyonik bileşiklere kıyasla)</li>
                          <li>Zayıf elektriksel iletkenlik</li>
                          <li>Polariteye bağlı olarak değişken çözünürlük</li>
                        </ul>
                      </>
                    ) : simulation.slug === 'state-change' ? (
                      <>
                        <h4>Maddenin Halleri</h4>
                        <p>Madde çeşitli hallerde bulunabilir, başlıca katı, sıvı ve gaz hallerinde. Her hal, parçacıkların düzeni ve hareketine dayalı olarak belirgin özelliklere sahiptir:</p>
                        <ul>
                          <li><strong>Katı:</strong> Parçacıklar güçlü moleküller arası kuvvetlerle düzenli bir şekilde sıkıca paketlenmiştir, bu da katılara sabit bir şekil ve hacim kazandırır.</li>
                          <li><strong>Sıvı:</strong> Parçacıklar yakın durumdadır ancak birbirlerinin üzerinden geçebilirler, bu da sıvıların akarken sabit bir hacmi koruyarak kaplarının şeklini almalarını sağlar.</li>
                          <li><strong>Gaz:</strong> Parçacıklar minimal moleküller arası kuvvetlerle geniş bir şekilde ayrılmıştır, bu da gazların genişleyerek kaplarını doldurmasını sağlar.</li>
                        </ul>
                        
                        <h4>Faz Geçişleri</h4>
                        <p>Maddeler bir halden diğerine geçtiğinde, faz geçişleri yaşarlar. Başlıca faz geçişleri şunlardır:</p>
                        <ul>
                          <li><strong>Erime (füzyon):</strong> Katı → Sıvı</li>
                          <li><strong>Donma:</strong> Sıvı → Katı</li>
                          <li><strong>Buharlaşma (kaynama):</strong> Sıvı → Gaz</li>
                          <li><strong>Yoğuşma:</strong> Gaz → Sıvı</li>
                          <li><strong>Süblimleşme:</strong> Katı → Gaz</li>
                          <li><strong>Kırağılaşma:</strong> Gaz → Katı</li>
                        </ul>
                        
                        <h4>Isı ve Sıcaklık</h4>
                        <p>Sıcaklık, bir maddedeki parçacıkların ortalama kinetik enerjisinin bir ölçüsüdür. Isı, sıcaklık farklılıkları nedeniyle maddeler arasında akan toplam enerjidir.</p>
                        <p>Bir maddeye ısı eklendiğinde veya çıkarıldığında, iki şeyden biri gerçekleşir:</p>
                        <ol>
                          <li>Madde aynı fazda kalırsa sıcaklık değişir</li>
                          <li>Madde erime veya kaynama noktasındaysa sabit sıcaklıkta bir faz değişimi gerçekleşir</li>
                        </ol>
                        
                        <h4>Isı Kapasitesi</h4>
                        <p>Isı kapasitesi (c), bir maddenin sıcaklığını bir derece yükseltmek için gereken ısı miktarıdır. Aynı maddenin farklı fazları arasında değişir:</p>
                        <p>Sıcaklığı değiştirmek için gereken enerji şu şekilde hesaplanır: Q = mc∆T, burada:</p>
                        <ul>
                          <li>Q = enerji (ısı) jul cinsinden</li>
                          <li>m = kütle gram cinsinden</li>
                          <li>c = özgül ısı kapasitesi J/g·°C cinsinden</li>
                          <li>∆T = sıcaklık değişimi °C cinsinden</li>
                        </ul>
                        
                        <h4>Gizli Isı</h4>
                        <p>Gizli ısı, bir maddenin sıcaklığını değiştirmeden fazını değiştirmek için gereken enerjidir:</p>
                        <ul>
                          <li><strong>Erime gizli ısısı:</strong> Bir katıyı erime noktasında sıvıya dönüştürmek için gereken enerji</li>
                          <li><strong>Buharlaşma gizli ısısı:</strong> Bir sıvıyı kaynama noktasında gaza dönüştürmek için gereken enerji</li>
                        </ul>
                        <p>Bir faz değişimi için gereken enerji şu şekilde hesaplanır: Q = mL, burada:</p>
                        <ul>
                          <li>Q = enerji (ısı) jul cinsinden</li>
                          <li>m = kütle gram cinsinden</li>
                          <li>L = gizli ısı J/g cinsinden</li>
                        </ul>
                      </>
                    ) : simulation.slug === 'gas-laws' ? (
                      <>
                        <h4>Gazların Özellikleri</h4>
                        <p>Gazların, onları katı ve sıvılardan ayıran birkaç benzersiz özellikleri vardır:</p>
                        <ul>
                          <li>Belirli bir şekil veya hacimleri yoktur ve kaplarını dolduracak şekilde genişlerler</li>
                          <li>Sıvı ve katılara göre kolayca sıkıştırılabilirler</li>
                          <li>Sıvı ve katılara göre daha düşük yoğunluğa sahiptirler</li>
                          <li>Gaz parçacıkları yüksek kinetik enerjiyle rastgele hareket ederler</li>
                          <li>Gaz parçacıkları çarpışmalar dışında ihmal edilebilir etkileşimlere sahiptir</li>
                        </ul>
                        
                        <h4>İdeal Gaz Yasası</h4>
                        <p>İdeal Gaz Yasası, gazların dört makroskopik özelliğini ilişkilendiren temel bir denklemdir:</p>
                        <p className="text-center font-medium my-2">PV = nRT</p>
                        <p>Burada:</p>
                        <ul>
                          <li><strong>P</strong> = basınç (atm, Pa veya diğer basınç birimleri)</li>
                          <li><strong>V</strong> = hacim (L, m³ veya diğer hacim birimleri)</li>
                          <li><strong>n</strong> = gaz mol sayısı</li>
                          <li><strong>R</strong> = gaz sabiti (0.08206 L·atm/mol·K)</li>
                          <li><strong>T</strong> = mutlak sıcaklık (K)</li>
                        </ul>
                        <p>Bu denklem, Boyle Yasası (P ∝ 1/V), Charles Yasası (V ∝ T) ve Avogadro Yasası'nın (V ∝ n) birleşiminden türetilmiştir.</p>
                        
                        <h4>Gazların Kinetik Teorisi</h4>
                        <p>Kinetik Moleküler Teori, gazların moleküler düzeydeki davranışını açıklar:</p>
                        <ul>
                          <li>Gaz parçacıkları sürekli ve rastgele hareket halindedir</li>
                          <li>Gaz parçacıkları arasındaki ve kap duvarlarıyla olan çarpışmalar tamamen elastiktir</li>
                          <li>Gaz parçacıklarının ortalama kinetik enerjisi mutlak sıcaklıkla orantılıdır</li>
                          <li>Gaz parçacıklarının hacmi kaba göre ihmal edilebilir düzeydedir</li>
                          <li>Parçacıklar arasında çekici veya itici kuvvetler yoktur</li>
                        </ul>
                        
                        <h4>Maxwell-Boltzmann Dağılımı</h4>
                        <p>Bu dağılım, belirli bir sıcaklıkta bir gazdaki moleküler hızların aralığını tanımlar:</p>
                        <ul>
                          <li><strong>En olası hız (v<sub>mp</sub>):</strong> Çoğu molekülün hareket ettiği hız</li>
                          <li><strong>Ortalama hız (v<sub>avg</sub>):</strong> Tüm moleküler hızların aritmetik ortalaması</li>
                          <li><strong>Karekök ortalama hız (v<sub>rms</sub>):</strong> √(3RT/M) (M, kg/mol cinsinden molar kütle)</li>
                        </ul>
                        <p>Daha yüksek sıcaklıklarda, dağılım daha yüksek hızlara doğru kayar ve aynı sıcaklıkta hafif gazlar daha yüksek ortalama hızlara sahiptir.</p>
                        
                        <h4>Gaz Karışımları ve Dalton Yasası</h4>
                        <p>Dalton'un Kısmi Basınçlar Yasası, tepkimeye girmeyen gazların bir karışımında, toplam basıncın her bir gazın kısmi basınçlarının toplamı olduğunu belirtir:</p>
                        <p className="text-center font-medium my-2">P<sub>toplam</sub> = P<sub>1</sub> + P<sub>2</sub> + ... + P<sub>n</sub></p>
                        <p>Her gazın kısmi basıncı, karışımdaki mol kesri ile orantılıdır:</p>
                        <p className="text-center font-medium my-2">P<sub>i</sub> = x<sub>i</sub> × P<sub>toplam</sub></p>
                        <p>burada x<sub>i</sub> mol kesridir (n<sub>i</sub>/n<sub>toplam</sub>).</p>
                        
                        <h4>Gerçek Gazlar ve Van der Waals Denklemi</h4>
                        <p>Gerçek gazlar, özellikle yüksek basınçlarda ve düşük sıcaklıklarda ideal davranıştan sapma gösterirler. Van der Waals denklemi şunları dikkate alır:</p>
                        <ul>
                          <li>Gaz moleküllerinin gerçek hacmi (b terimi)</li>
                          <li>Moleküller arasındaki çekici kuvvetler (a terimi)</li>
                        </ul>
                        <p className="text-center font-medium my-2">(P + a(n/V)²)(V - nb) = nRT</p>
                        <p>Burada a ve b gaza özgü sabitlerdir:</p>
                        <ul>
                          <li>a, moleküller arasındaki çekici kuvvetleri hesaba katar</li>
                          <li>b, gaz moleküllerinin sonlu hacmini hesaba katar</li>
                        </ul>
                        <p>Düşük basınçlarda ve yüksek sıcaklıklarda, Van der Waals denklemi ideal gaz yasasına yaklaşır.</p>
                      </>
                    ) : (
                      <p>Bu simülasyon için teorik arka plan yakında eklenecektir.</p>
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
                          <li>50 mL 0.1 M HCl çözeltiniz varsa, eşdeğerlik noktasına ulaşmak için kaç mL 0.1 M NaOH'ye ihtiyacınız olur?</li>
                          <li>Güçlü asit-güçlü baz titrasyonunda eşdeğerlik noktasındaki pH nedir?</li>
                          <li>Zayıf asidi güçlü bazla titre ettiğinizde pH nasıl değişir, bunu güçlü asidi güçlü bazla titre etmekle karşılaştırın?</li>
                          <li>Neden pH başlangıçta yavaşça, eşdeğerlik noktasına yaklaştıkça ise hızla değişir?</li>
                          <li>Analit ve titrantın konsantrasyonlarını iki katına çıkarırsanız, bu durum eşdeğerlik noktasına ulaşmak için gereken hacmi nasıl etkiler?</li>
                          <li>Titrasyonda indikatör kullanmanın amacı nedir?</li>
                          <li>Asit-baz titrasyonu için uygun bir indikatörü nasıl seçersiniz?</li>
                          <li>50 mL 0.1 M HCl'ye 24.5 mL 0.1 M NaOH eklendiğinde pH'ı hesaplayın.</li>
                        </ol>
                      </>
                    ) : simulation.slug === 'state-change' ? (
                      <>
                        <ol>
                          <li>-10°C'deki 100g buzu 20°C'deki suya dönüştürmek için ne kadar enerji gereklidir? (Suyun katı hal için ısı kapasitesi = 2.108 J/g°C, erime gizli ısısı = 333.55 J/g, sıvı hal için ısı kapasitesi = 4.18 J/g°C)</li>
                          <li>Sisteme sürekli ısı eklenmesine rağmen, erime ve kaynama süreçlerinde sıcaklığın neden sabit kaldığını açıklayın.</li>
                          <li>Suyun neden sıvı halinde katı haline göre daha yüksek özgül ısı kapasitesi vardır?</li>
                          <li>Su, demir ve azotun erime ve kaynama noktalarını karşılaştırın. Moleküller arası kuvvetler açısından farklılıkları açıklayın.</li>
                          <li>25°C'deki 50g suyu 110°C'deki buhara dönüştürmek için gereken toplam enerjiyi hesaplayın.</li>
                          <li>0°C'deki 20g buza 500 J ısı eklenirse, ne kadar buz eriyecektir? Hepsi eriyecek midir?</li>
                          <li>Çoğu maddenin yoğunluğu katıdan sıvıya ve gaza geçerken neden azalır? Su bu açıdan neden sıra dışıdır?</li>
                          <li>Maddenin kütlesini artırmak, sabit bir ısıtma hızında faz değişimini tamamlamak için gereken süreyi nasıl etkiler?</li>
                        </ol>
                      </>
                    ) : simulation.slug === 'gas-laws' ? (
                      <>
                        <ol>
                          <li>Bir gaz 1.2 atm ve 298 K'de 2.5 L hacim kaplar. 0.8 atm ve 320 K'de hacmi ne olur?</li>
                          <li>300 K'de 36.0 L hacim kaplayan 1.5 mol ideal gazın basıncı atmosfer cinsinden nedir?</li>
                          <li>25°C'de oksijen (O<sub>2</sub>) moleküllerinin karekök ortalama hızı nedir? (O<sub>2</sub>'nin molar kütlesi = 32.0 g/mol)</li>
                          <li>Gazların yüksek basınçlarda ve düşük sıcaklıklarda neden ideal davranıştan saptığını açıklayın.</li>
                          <li>Bir gaz karışımı 0.25 mol oksijen, 0.50 mol azot ve 0.15 mol karbon dioksit içerir. Toplam basınç 1.5 atm ise, azotun kısmi basıncı nedir?</li>
                          <li>Van der Waals denklemini kullanarak, 300 K ve 5.0 atm'de 1.0 mol metanın hacmini hesaplayın. (Metan için, a = 2.283 L²·atm/mol², b = 0.04278 L/mol)</li>
                          <li>Neden hafif gazlar, aynı sıcaklıkta ağır gazlardan daha hızlı difüzyon yapar?</li>
                          <li>300 K'de helyum ve azotun moleküler hızlarını karşılaştırın. Hangisinin ortalama kinetik enerjisi daha yüksektir?</li>
                          <li>Bir gazın sıcaklığı (Kelvin cinsinden) iki katına çıkarsa, bu durum aşağıdakileri nasıl etkiler:
                            <ol type="a">
                              <li>Moleküllerin ortalama kinetik enerjisi</li>
                              <li>Moleküllerin ortalama hızı</li>
                              <li>Basınç (hacim sabit ise)</li>
                            </ol>
                          </li>
                          <li>25°C'de 1.5 L kaptaki 2.5 g oksijen gazının uyguladığı basıncı hem ideal gaz yasasını hem de Van der Waals denklemini kullanarak hesaplayın. Sonuçları karşılaştırın.</li>
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
