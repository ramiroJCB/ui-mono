import * as React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

export const WorkersOnsiteIcon: React.SFC<SvgIconProps> = props => (
  <SvgIcon {...props} viewBox="20 0 60 99">
    <g>
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M89.5112391 38.8779398L79.5702402 38.8779398C76.8364656 38.8779398 74.3667486 40.0116821 72.5649426 41.8480252 78.8246653 45.3769977 83.2670492 51.7483101 84.2300835 59.3172376L94.4817386 59.3172376C97.2310461 59.3172376 99.452238 57.0337848 99.452238 54.2074132L99.452238 49.0975887C99.452238 43.4608136 94.9943213 38.8779398 89.5112391 38.8779398zM84.9696006 11.2029708C88.1977846 13.0771586 89.872843 15.8671227 90.0362481 19.6627642 90.1780627 19.6627642 90.307451 19.6571754 90.4363733 19.6635626 91.1619109 19.6999701 91.724354 20.3046859 91.7279265 21.0483251 91.7314991 21.7850979 91.1608236 22.3947638 90.4331114 22.4274986 90.2524649 22.4356424 90.0713523 22.4316504 89.890395 22.4316504 83.8363267 22.43181 77.7821031 22.43181 71.7280348 22.4316504 71.5711534 22.4316504 71.414272 22.4332472 71.2577013 22.4292551 70.482148 22.4099336 69.8903479 21.8048984 69.8976483 21.0406603 69.9049488 20.2824901 70.4790414 19.6887924 71.2328488 19.6614868 71.3406465 19.6576544 71.4485995 19.6610077 71.5887054 19.6610077 71.7440336 15.8937896 73.4086849 13.0899331 76.654421 11.204887 76.7909544 11.9897241 76.9178575 12.7137223 77.0427413 13.4380399 77.1670038 14.1577268 77.2866064 14.878212 77.4133541 15.5974198 77.4949014 16.0600186 77.8167412 16.3143921 78.2254095 16.2505193 78.6273986 16.1877642 78.8720404 15.8406155 78.7954636 15.3705117 78.5502006 13.8679039 78.290958 12.3676914 78.0314047 10.8676385 77.9285775 10.2739408 77.9815444 10.0556555 78.4949038 9.77221992 78.8018321 9.60279731 79.1690277 9.48319548 79.5149434 9.4661095 80.3812083 9.4234744 81.2515117 9.43193755 82.1188638 9.46307554 82.4208217 9.47393392 82.739555 9.56623013 83.0137091 9.70084206 83.6019366 9.98970683 83.69824 10.247753 83.5836079 10.9117108 83.3369469 12.3387889 83.0891985 13.7655477 82.8568277 15.1950211 82.8223448 15.4067595 82.8183063 15.6509133 82.887738 15.8473222 82.9972443 16.1563069 83.2670492 16.2923559 83.5876464 16.2527548 83.9414838 16.2090019 84.1462063 15.9841697 84.2080269 15.6263223 84.3809071 14.6260741 84.5505254 13.6255066 84.7223182 12.6250988 84.799361 12.1755939 84.878423 11.7264084 84.9696006 11.2029708M90.3734654 24.168831C90.3734654 24.4974566 90.3962987 24.8168206 90.3689609 25.1315539 90.2981313 25.9406626 90.1134462 26.7261385 89.703846 27.4260247 89.5294125 27.724151 89.2504432 27.9569674 89.0242855 28.2242751 88.9484854 28.313697 88.8672488 28.4088675 88.8254655 28.5166529 88.1878436 30.1628148 87.3599448 31.6960815 86.2269816 33.0367717 84.9705326 34.5235709 83.5238066 35.7213457 81.5609253 36.0659395 80.1141993 36.3199936 78.7835034 35.9683738 77.5556347 35.1918401 75.4815385 33.8802121 74.1242815 31.934327 73.0644778 29.7351863 72.978892 29.5576199 72.89983 29.3768599 72.820302 29.1964192 72.6270738 28.7579324 72.543818 28.2499839 72.0275074 28.0296227 71.8987404 27.9746921 71.8033689 27.8057486 71.7216663 27.6706576 71.0775206 26.6041414 70.8619252 25.4303189 70.8912822 24.168831L90.3734654 24.168831zM9.94099888 38.8779398L19.8819978 38.8779398C22.6157724 38.8779398 25.0854893 40.0116821 26.8872954 41.8480252 20.6275727 45.3769977 16.1851888 51.7483101 15.2221545 59.3172376L4.97049944 59.3172376C2.22119194 59.3172376 0 57.0337848 0 54.2074132L0 49.0975887C0 43.4608136 4.45791668 38.8779398 9.94099888 38.8779398zM14.4825442 11.2029708C11.2543602 13.0771586 9.57934844 15.8671227 9.41589668 19.6627642 9.27417531 19.6627642 9.14467827 19.6571754 9.01575594 19.6635626 8.29029601 19.6999701 7.72786847 20.3046859 7.72424932 21.0483251 7.72069231 21.7850979 8.29132118 22.3947638 9.0190023 22.4274986 9.19967995 22.4356424 9.38087019 22.4316504 9.5617653 22.4316504 15.615756 22.43181 21.6699796 22.43181 27.7242032 22.4316504 27.8809293 22.4316504 28.0378107 22.4332472 28.1945367 22.4292551 28.97009 22.4099336 29.5617347 21.8048984 29.5544343 21.0406603 29.5472892 20.2824901 28.9731966 19.6887924 28.2192339 19.6614868 28.1115915 19.6576544 28.0036385 19.6610077 27.8635326 19.6610077 27.7080491 15.8937896 26.0435531 13.0899331 22.7976617 11.204887 22.6611282 11.9897241 22.5343805 12.7137223 22.4093414 13.4380399 22.2852342 14.1577268 22.1656316 14.878212 22.0388839 15.5974198 21.9573366 16.0600186 21.6353414 16.3143921 21.2268285 16.2505193 20.824684 16.1877642 20.5801976 15.8406155 20.6567744 15.3705117 20.9020374 13.8679039 21.1611247 12.3676914 21.4208333 10.8676385 21.5235052 10.2739408 21.4705383 10.0556555 20.9573342 9.77221992 20.6504059 9.60279731 20.2832103 9.48319548 19.9372946 9.4661095 19.0708744 9.4234744 18.200571 9.43193755 17.3333742 9.46307554 17.0314163 9.47393392 16.712683 9.56623013 16.4385289 9.70084206 15.8501461 9.98970683 15.7538426 10.247753 15.8686301 10.9117108 16.1152911 12.3387889 16.3628841 13.7655477 16.5954103 15.1950211 16.6297378 15.4067595 16.6339317 15.6509133 16.5643447 15.8473222 16.4549937 16.1563069 16.1850335 16.2923559 15.8644363 16.2527548 15.5106454 16.2090019 15.3060162 15.9841697 15.2441179 15.6263223 15.0713309 14.6260741 14.901666 13.6255066 14.7298887 12.6250988 14.6527994 12.1755939 14.5736907 11.7264084 14.4825442 11.2029708M9.07877255 24.168831C9.07877255 24.4974566 9.05583059 24.8168206 9.08326153 25.1315539 9.15398242 25.9406626 9.33871414 26.7261385 9.74826776 27.4260247 9.92273229 27.724151 10.2017016 27.9569674 10.4279059 28.2242751 10.5036905 28.313697 10.5849892 28.4088675 10.6266793 28.5166529 11.2643322 30.1628148 12.0922 31.6960815 13.2251166 33.0367717 14.4816588 34.5235709 15.9282761 35.7213457 17.8911574 36.0659395 19.3378834 36.3199936 20.6685793 35.9683738 21.8966033 35.1918401 23.9706995 33.8802121 25.3279565 31.934327 26.3877602 29.7351863 26.473346 29.5576199 26.552408 29.3768599 26.631936 29.1964192 26.8251642 28.7579324 26.9082647 28.2499839 27.4247306 28.0296227 27.5534976 27.9746921 27.6488691 27.8057486 27.7304164 27.6706576 28.3747174 26.6041414 28.5901574 25.4303189 28.5608004 24.168831L9.07877255 24.168831zM61.6764423 43.9877642L60.387219 43.9877642C57.1563943 45.5845844 53.5683151 46.5426765 49.7472436 46.5426765 45.9261722 46.5426765 42.3536257 45.5845844 39.1072683 43.9877642L37.818045 43.9877642C27.9391773 43.9877642 19.924247 52.2273562 19.924247 62.3831323L19.924247 66.9819743C19.924247 71.2135477 23.2638013 74.646711 27.3799962 74.646711L72.1144911 74.646711C76.2306859 74.646711 79.5702402 71.2135477 79.5702402 66.9819743L79.5702402 62.3831323C79.5702402 52.2273562 71.5553099 43.9877642 61.6764423 43.9877642zM56.5927086 2.90844821C61.9089684 5.99462251 64.6674403 10.5893128 64.9366239 16.8400653 65.1700821 16.8400653 65.3833476 16.8308037 65.5955258 16.8415024 66.7903096 16.9015428 67.7165311 17.8971602 67.7224335 19.1219212 67.728336 20.3351852 66.7886009 21.3392657 65.5902446 21.3930785 65.2926359 21.4064918 64.9942506 21.3999449 64.6964867 21.3999449 54.7264414 21.4002642 44.7562409 21.4002642 34.7860403 21.4001045 34.527885 21.4001045 34.2695744 21.4026595 34.011419 21.3961125 32.7343113 21.3641761 31.7599381 20.3677603 31.7718984 19.1091467 31.7838587 17.860593 32.7291855 16.8830197 33.9707231 16.8381491 34.1481078 16.8316021 34.3259585 16.837191 34.5566207 16.837191 34.8126014 10.6332253 37.5538319 6.01570053 42.899138 2.91164185 43.1240531 4.20378871 43.3328141 5.39613432 43.5386238 6.58895897 43.743191 7.77427856 43.940147 8.96087561 44.148908 10.1452371 44.2831115 10.90708 44.8132463 11.3259259 45.4861277 11.2208552 46.1482914 11.1173812 46.5510572 10.5457196 46.4249307 9.77142151 46.0209223 7.29698902 45.594236 4.82638889 45.1666177 2.35610812 44.9974654 1.37837515 45.0846045 1.01877125 45.9299001.552020724 46.435493.273056245 47.04003.0760086389 47.6097735.0480642864 49.0364622-.022036118 50.46983-.00830346476 51.8980719.0431141439 52.3952772.0609985295 52.9201309.213015807 53.3716697.434654444 54.3404511.910347165 54.4990411 1.33526101 54.3101621 2.42876344 53.9039791 4.77880365 53.4960875 7.12852449 53.113359 9.48255675 53.056509 9.83130227 53.0498298 10.2332219 53.1643067 10.556578 53.3444873 11.0654846 53.7890363 11.2896781 54.3169965 11.2243682 54.8996323 11.1523516 55.2366943 10.782049 55.3385895 10.1926627 55.6231506 8.54570237 55.9025859 6.89778398 56.1854383 5.25034464 56.3123414 4.51005882 56.4426617 3.77025204 56.5927086 2.90844821"
      />
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M65.4917666,24.2606481 C65.4917666,24.8018105 65.5296666,25.3278031 65.4844662,25.8462906 C65.3679701,27.1786773 65.0636823,28.4722613 64.3892477,29.6248461 C64.1018907,30.1158683 63.6425855,30.4992648 63.2699533,30.9395081 C63.1452249,31.0867349 63.011332,31.2435426 62.942677,31.4209494 C61.892659,34.1317112 60.5291889,36.6569226 58.663543,38.8646862 C56.5942619,41.3132502 54.2118394,43.2858021 50.9793062,43.853312 C48.5967283,44.2716788 46.4053594,43.6926719 44.3831428,42.4136189 C40.9674777,40.2536003 38.7323062,37.0491016 36.9868843,33.4275136 C36.8460017,33.1352955 36.7158367,32.8374885 36.5848951,32.5403203 C36.2666278,31.8182382 36.1297838,30.9816641 35.2793624,30.6188666 C35.0671842,30.5284866 34.9101475,30.2501608 34.7757887,30.0275641 C33.7147424,28.2712216 33.359973,26.3384305 33.40828,24.2606481 L65.4917666,24.2606481 Z"
      />
    </g>
  </SvgIcon>
);
