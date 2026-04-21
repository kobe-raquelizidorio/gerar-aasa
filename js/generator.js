export function montarComponent(path, exclude=false){
  return {
    "/": path,
    ...(exclude ? {exclude: true} : {}),
    comment: exclude
      ? `Matches any URL with a path ${path} and instructs the system not to open it as a universal link.`
      : `Matches any URL with a path that starts with ${path}`
  };
}

export function gerarJSON({paths, excluir, teamId, packageName, appclips}){
  const incluir = paths.filter(p => !excluir.includes(p));

  const components = [
    ...incluir.map(p => montarComponent(p, false)),
    ...excluir.map(p => montarComponent(p, true))
  ];

  const appId = `${teamId}.${packageName}`;

  let resultado = {
    applinks: {
      details: [{
        appIDs: [appId],
        components
      }]
    },
    webcredentials: { apps: [appId] },
    activitycontinuation: { apps: [appId] }
  };

  if (appclips) {
    resultado.appclips = {
      apps: [`${appId}.Clip`]
    };
  }

  return resultado;
}

export function baixarJSON(data){
  const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
  const a = document.createElement("a");
  const url = URL.createObjectURL(blob);

  a.href = url;
  a.download = "apple-app-site-association";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1500);
}